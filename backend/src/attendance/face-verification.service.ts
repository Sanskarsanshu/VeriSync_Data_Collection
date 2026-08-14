import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FaceVerificationService {
  private readonly similarityThreshold: number;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    const configured = Number(
      config.get<string>('FACE_SIMILARITY_THRESHOLD', '0.85'),
    );
    this.similarityThreshold =
      Number.isFinite(configured) && configured > 0 ? configured : 0.85;
  }

  /**
   * Abstracted method to find the best match for a given facial embedding.
   * Can be swapped out for pgvector or an ANN index in the future.
   */
  async findBestMatch(embedding: number[], sectionId?: string) {
    // 1. Fetch all students who have face embeddings (optionally section-scoped)
    const students = await this.prisma.student.findMany({
      where: { status: 'ACTIVE', ...(sectionId ? { sectionId } : {}) },
      include: { faceEmbedding: true },
    });

    let bestMatch: any = null;
    let highestSimilarity = -1;

    // Linear search using Cosine Similarity
    for (const student of students) {
      if (
        student.faceEmbedding?.embedding &&
        Array.isArray(student.faceEmbedding.embedding)
      ) {
        const storedEmbedding = student.faceEmbedding.embedding;
        const similarity = this.cosineSimilarity(embedding, storedEmbedding);

        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          bestMatch = student;
        }
      }
    }

    if (bestMatch && highestSimilarity >= this.similarityThreshold) {
      return {
        matched: true,
        student: bestMatch,
        confidence: highestSimilarity,
      };
    }

    return { matched: false, student: null, confidence: highestSimilarity };
  }

  /**
   * Validates cryptographic or challenge-response evidence for Liveness.
   * The expected signature is read from configuration (FACE_LIVENESS_SIGNATURE).
   * If no signature is configured the verification FAILS CLOSED so that a
   * misconfigured deployment cannot silently accept client-supplied evidence.
   */
  async validateLiveness(evidence: any) {
    if (!evidence || !evidence.challengeId || !evidence.signature) {
      throw new HttpException(
        'Missing Liveness Evidence. Request rejected.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const expectedSignature = this.config.get<string>(
      'FACE_LIVENESS_SIGNATURE',
    );
    if (!expectedSignature) {
      throw new HttpException(
        'Liveness verification is not configured. Request rejected.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    if (evidence.signature !== expectedSignature) {
      throw new HttpException(
        'Liveness challenge failed or tampered.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length || a.length === 0) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }
}
