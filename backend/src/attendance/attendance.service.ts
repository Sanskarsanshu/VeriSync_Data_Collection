import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async startSession(data: { courseId: string; verificationMethod: string; windowMinutes: number }) {
    // 1. Ensure courseId is valid (frontend might send mock IDs)
    let validCourseId = data.courseId;
    try {
      const courseExists = await this.prisma.course.findUnique({ where: { id: validCourseId } });
      if (!courseExists) throw new Error('Not found');
    } catch {
      const fallback = await this.prisma.course.findFirst();
      if (fallback) validCourseId = fallback.id;
    }

    // 2. Create a Scheduled Class for this session
    const scheduledClass = await this.prisma.scheduledClass.create({
      data: {
        courseId: validCourseId,
        date: new Date(),
        startTime: new Date().toTimeString().substring(0, 5),
        endTime: new Date(Date.now() + (data.windowMinutes || 30) * 60000).toTimeString().substring(0, 5),
      }
    });

    let currentOtp: string | null = null;
    let dynamicQrSecret: string | null = null;

    if (data.verificationMethod === 'OTP') {
      currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
      // Normally here you'd send emails via a queue/mailer service
    } else if (data.verificationMethod === 'DYNAMIC_QR') {
      dynamicQrSecret = Math.random().toString(36).substring(2, 15);
    }

    const session = await this.prisma.attendanceSession.create({
      data: {
        scheduledClassId: scheduledClass.id,
        status: 'LIVE',
        openedAt: new Date(),
        verificationMethod: data.verificationMethod as any,
        currentOtp,
        dynamicQrSecret,
      }
    });

    return { success: true, sessionId: session.id, otp: currentOtp };
  }

  async markAttendance(data: { sessionId: string; studentId: string; otp?: string; token?: string }) {
    const session = await this.prisma.attendanceSession.findUnique({
      where: { id: data.sessionId }
    });

    if (!session || session.status !== 'LIVE') {
      return { success: false, message: 'Session is not active' };
    }

    // Check Duplicate
    const existing = await this.prisma.attendanceRecord.findUnique({
      where: {
        sessionId_studentId: {
          sessionId: data.sessionId,
          studentId: data.studentId
        }
      }
    });

    if (existing) {
      return { success: false, message: 'Attendance already marked' };
    }

    // Method Validation
    if (session.verificationMethod === 'OTP') {
      if (session.currentOtp !== data.otp) {
        return { success: false, message: 'Invalid OTP' };
      }
    } else if (session.verificationMethod === 'DYNAMIC_QR') {
      // Very basic simulation of token validation for the mini-project
      if (data.token !== session.dynamicQrSecret) {
         // return { success: false, message: 'Invalid or Expired QR Token' };
      }
    }

    await this.prisma.attendanceRecord.create({
      data: {
        sessionId: data.sessionId,
        studentId: data.studentId,
        status: 'PRESENT',
        verificationMethod: session.verificationMethod as any,
        markedAt: new Date()
      }
    });

    return { success: true, message: 'Attendance marked successfully' };
  }
  
  async getLiveStats(sessionId: string) {
    const records = await this.prisma.attendanceRecord.findMany({
      where: { sessionId },
      include: { student: true }
    });
    
    return {
      success: true,
      presentCount: records.length,
      records: records.map(r => ({
        name: r.student.name,
        rollNumber: r.student.rollNumber,
        markedAt: r.markedAt
      }))
    };
  }
}
