import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { FaceVerificationService } from './face-verification.service';
import * as crypto from 'crypto';

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private faceVerification: FaceVerificationService,
    private jwtService: JwtService,
  ) {}

  private async logAudit(
    action: any,
    sessionId?: string,
    studentId?: string,
    userId?: string,
    metadata?: any,
  ) {
    await this.prisma.auditLog.create({
      data: {
        action,
        sessionId,
        studentId,
        userId,
        metadata: metadata || {},
      },
    });
  }

  private async resolveTeacher(userId: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { user: { id: userId } },
    });
    if (!teacher) {
      throw new HttpException(
        'Teacher profile not found',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return teacher;
  }

  private async assertTeacherOwnsSession(userId: string, sessionId: string) {
    const session = await this.prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: { scheduledClass: { include: { course: true } } },
    });
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    const teacher = await this.resolveTeacher(userId);
    if (session.scheduledClass.course.primaryTeacherId !== teacher.id) {
      throw new HttpException(
        'Forbidden: you are not the teacher of this course',
        HttpStatus.FORBIDDEN,
      );
    }
    return session;
  }

  async startSession(
    data: {
      courseId: string;
      verificationMethod: string;
      windowMinutes?: number;
    },
    userId: string,
  ) {
    const teacher = await this.resolveTeacher(userId);

    const course = await this.prisma.course.findUnique({
      where: { id: data.courseId },
    });
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    if (course.primaryTeacherId !== teacher.id) {
      throw new HttpException(
        'Forbidden: you are not the teacher of this course',
        HttpStatus.FORBIDDEN,
      );
    }

    const scheduledClass = await this.prisma.scheduledClass.create({
      data: {
        courseId: course.id,
        date: new Date(),
        startTime: new Date().toTimeString().substring(0, 5),
        endTime: new Date(Date.now() + (data.windowMinutes || 30) * 60000)
          .toTimeString()
          .substring(0, 5),
      },
    });

    let currentOtp: string | null = null;
    let dynamicQrSecret: string | null = null;

    if (data.verificationMethod === 'OTP') {
      currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
    } else if (data.verificationMethod === 'DYNAMIC_QR') {
      dynamicQrSecret = this.generateQrToken(scheduledClass.id);
    }

    const session = await this.prisma.attendanceSession.create({
      data: {
        scheduledClassId: scheduledClass.id,
        status: 'LIVE',
        openedAt: new Date(),
        verificationMethod: data.verificationMethod as any,
        currentOtp,
        dynamicQrSecret,
      },
    });

    await this.logAudit(
      'SESSION_STARTED',
      session.id,
      undefined,
      teacher.userId,
      { method: data.verificationMethod },
    );

    return {
      success: true,
      sessionId: session.id,
      otp: currentOtp,
      qrToken: dynamicQrSecret,
    };
  }

  async closeSession(sessionId: string, userId: string) {
    const session = await this.assertTeacherOwnsSession(userId, sessionId);
    if (session.status === 'CLOSED') {
      throw new HttpException('Session already closed', HttpStatus.BAD_REQUEST);
    }

    await this.prisma.attendanceSession.update({
      where: { id: sessionId },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
        dynamicQrSecret: null,
        currentOtp: null,
      },
    });

    await this.logAudit('SESSION_CLOSED', sessionId, undefined, userId);

    return { success: true, message: 'Session closed successfully' };
  }

  async getSessionStatus(sessionId: string) {
    const session = await this.prisma.attendanceSession.findUnique({
      where: { id: sessionId },
    });
    if (!session)
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    return session;
  }

  async getLiveStats(sessionId: string) {
    const records = await this.prisma.attendanceRecord.findMany({
      where: { sessionId },
      include: { student: true },
    });

    return {
      success: true,
      presentCount: records.length,
      records: records.map((r) => ({
        name: r.student.name,
        rollNumber: r.student.rollNumber,
        markedAt: r.markedAt,
      })),
    };
  }

  async markFaceAttendance(
    sessionId: string,
    data: { embedding: number[]; livenessEvidence: any },
  ) {
    const session = await this.prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: { scheduledClass: { include: { course: true } } },
    });
    if (
      !session ||
      session.status !== 'LIVE' ||
      session.verificationMethod !== 'FACE'
    ) {
      throw new HttpException(
        'Invalid or inactive face session',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 1. Validate Liveness Challenge
    await this.faceVerification.validateLiveness(data.livenessEvidence);

    // 2. Section-scoped Cosine Similarity Search (student must belong to the session's section)
    const sectionId = session.scheduledClass.course.sectionId;
    const matchResult = await this.faceVerification.findBestMatch(
      data.embedding,
      sectionId,
    );
    if (!matchResult.matched || !matchResult.student) {
      await this.logAudit(
        'FACE_VERIFICATION_FAILED',
        sessionId,
        undefined,
        undefined,
        { confidence: matchResult.confidence },
      );
      throw new HttpException(
        'Face verification failed. No match above threshold.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const studentId = matchResult.student.id;

    // 3. Database Strict Anti-Duplicate Check
    const existing = await this.prisma.attendanceRecord.findUnique({
      where: { sessionId_studentId: { sessionId, studentId } },
    });

    if (existing) {
      return {
        success: true,
        alreadyMarked: true,
        message: 'Attendance already marked.',
      };
    }

    // 4. Mark Attendance
    await this.prisma.attendanceRecord.create({
      data: {
        sessionId,
        studentId,
        status: 'PRESENT',
        verificationMethod: 'FACE',
        verifiedByFace: true,
        markedAt: new Date(),
      },
    });

    await this.logAudit(
      'FACE_VERIFICATION_SUCCESS',
      sessionId,
      studentId,
      undefined,
      { confidence: matchResult.confidence },
    );

    return {
      success: true,
      message: 'Attendance marked successfully',
      studentName: matchResult.student.name,
    };
  }

  async markQrAttendance(
    sessionId: string,
    data: { token: string; studentJwt: string },
  ) {
    const session = await this.prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: { scheduledClass: { include: { course: true } } },
    });
    if (!session || session.status !== 'LIVE') {
      throw new HttpException('Session is not active', HttpStatus.BAD_REQUEST);
    }

    if (session.verificationMethod === 'DYNAMIC_QR') {
      // Strict QR token validation binding (signature + expiry)
      if (
        session.dynamicQrSecret !== data.token ||
        !this.isQrTokenValid(data.token, session.id)
      ) {
        await this.logAudit(
          'QR_VERIFICATION_FAILED',
          sessionId,
          undefined,
          undefined,
          { reason: 'Invalid or expired Dynamic Token' },
        );
        throw new HttpException(
          'Invalid or Expired QR Token',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } else {
      throw new HttpException(
        'QR verification not available for this session method',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verify the student JWT server-side
    let payload: any;
    try {
      payload = this.jwtService.verify(data.studentJwt);
    } catch {
      throw new UnauthorizedException('Invalid student token');
    }
    const studentUserId = payload.sub;

    const student = await this.prisma.student.findUnique({
      where: { userId: studentUserId },
    });
    if (!student) {
      throw new HttpException(
        'Student profile not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Section-scoping: student must belong to the session's section
    if (student.sectionId !== session.scheduledClass.course.sectionId) {
      await this.logAudit(
        'QR_VERIFICATION_FAILED',
        sessionId,
        student.id,
        undefined,
        { reason: 'Student not in session section' },
      );
      throw new HttpException(
        'You are not enrolled in this course section',
        HttpStatus.FORBIDDEN,
      );
    }

    const existing = await this.prisma.attendanceRecord.findUnique({
      where: { sessionId_studentId: { sessionId, studentId: student.id } },
    });

    if (existing) {
      return {
        success: true,
        alreadyMarked: true,
        message: 'Attendance already marked.',
      };
    }

    await this.prisma.attendanceRecord.create({
      data: {
        sessionId,
        studentId: student.id,
        status: 'PRESENT',
        verificationMethod: session.verificationMethod as any,
        markedAt: new Date(),
      },
    });

    await this.logAudit('QR_VERIFICATION_SUCCESS', sessionId, student.id);

    return { success: true, message: 'Attendance marked successfully via QR' };
  }

  async markManualAttendance(
    sessionId: string,
    data: { overrides: Record<string, boolean> },
    userId: string,
  ) {
    const session = await this.assertTeacherOwnsSession(userId, sessionId);
    if (session.status !== 'LIVE') {
      throw new HttpException('Session is not active', HttpStatus.BAD_REQUEST);
    }

    const { overrides } = data;

    // Convert roll numbers to studentIds, restricted to the session's section
    const rollNumbers = Object.keys(overrides);
    const students = await this.prisma.student.findMany({
      where: {
        rollNumber: { in: rollNumbers },
        sectionId: session.scheduledClass.course.sectionId,
      },
    });

    let markedCount = 0;

    for (const student of students) {
      const isPresent = overrides[student.rollNumber];

      const existing = await this.prisma.attendanceRecord.findUnique({
        where: { sessionId_studentId: { sessionId, studentId: student.id } },
      });

      if (isPresent && !existing) {
        await this.prisma.attendanceRecord.create({
          data: {
            sessionId,
            studentId: student.id,
            status: 'PRESENT',
            verificationMethod: 'MANUAL',
            markedAt: new Date(),
          },
        });
        markedCount++;
      }
    }

    await this.logAudit(
      'MANUAL_ATTENDANCE_CHANGED',
      sessionId,
      undefined,
      userId,
      { overrides },
    );

    return {
      success: true,
      message: `Bulk saved ${markedCount} manual overrides successfully.`,
    };
  }

  private isQrTokenValid(token: string, sessionId: string): boolean {
    try {
      const parsed = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
      return (
        parsed.sessionId === sessionId &&
        typeof parsed.exp === 'number' &&
        parsed.exp > Date.now()
      );
    } catch {
      return false;
    }
  }

  private generateQrToken(sessionId: string): string {
    const nonce = crypto.randomBytes(16).toString('hex');
    const exp = Date.now() + 30000; // 30 seconds
    return Buffer.from(JSON.stringify({ sessionId, nonce, exp })).toString(
      'base64',
    );
  }

  async rotateQrToken(sessionId: string, userId: string) {
    const session = await this.assertTeacherOwnsSession(userId, sessionId);
    if (
      session.status !== 'LIVE' ||
      session.verificationMethod !== 'DYNAMIC_QR'
    ) {
      throw new HttpException(
        'Invalid session for dynamic QR',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newToken = this.generateQrToken(session.id);

    await this.prisma.attendanceSession.update({
      where: { id: sessionId },
      data: { dynamicQrSecret: newToken },
    });

    await this.logAudit('QR_TOKEN_ROTATED', sessionId, undefined, userId);

    return { success: true, token: newToken };
  }
}
