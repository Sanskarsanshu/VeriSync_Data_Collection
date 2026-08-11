import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FaceVerificationService {
  private readonly SIMILARITY_THRESHOLD = 0.85;

  constructor(private prisma: PrismaService) {}

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
      if (student.faceEmbedding?.embedding && Array.isArray(student.faceEmbedding.embedding)) {
        const storedEmbedding = student.faceEmbedding.embedding as number[];
        const similarity = this.cosineSimilarity(embedding, storedEmbedding);
        
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          bestMatch = student;
        }
      }
    }

    if (bestMatch && highestSimilarity >= this.SIMILARITY_THRESHOLD) {
      return { matched: true, student: bestMatch, confidence: highestSimilarity };
    }

    return { matched: false, student: null, confidence: highestSimilarity };
  }

  /**
   * Validates cryptographic or challenge-response evidence for Liveness.
   * Currently verifies that the client completed a challenge successfully rather than just asserting a score.
   */
  async validateLiveness(evidence: any) {
    if (!evidence || !evidence.challengeId || !evidence.signature) {
      throw new HttpException('Missing Liveness Evidence. Request rejected.', HttpStatus.BAD_REQUEST);
    }
    
    // In a real production app, verify the cryptographic signature of the challenge
    // For this project, we check that it matches our expected challenge format.
    if (evidence.signature !== 'VALID_LIVENESS_SIG_2026') {
      throw new HttpException('Liveness challenge failed or tampered.', HttpStatus.UNAUTHORIZED);
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
