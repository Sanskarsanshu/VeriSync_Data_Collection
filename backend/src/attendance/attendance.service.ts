import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async simulateClass(data: any) {
    // 1. Get default section, subject, teacher
    let section = await this.prisma.section.findFirst();
    let subject = await this.prisma.subject.findFirst();
    let teacher = await this.prisma.teacher.findFirst();

    if (!section || !subject || !teacher) {
        throw new Error('Database not seeded properly for simulations.');
    }

    // 2. Find or Create Course
    let course = await this.prisma.course.findFirst({
        where: {
            subjectId: subject.id,
            sectionId: section.id,
            primaryTeacherId: teacher.id
        }
    });

    if (!course) {
        course = await this.prisma.course.create({
            data: {
                subjectId: subject.id,
                sectionId: section.id,
                primaryTeacherId: teacher.id,
                status: 'ACTIVE'
            }
        });
    }

    // 3. Create Scheduled Class
    const now = new Date();
    const scheduledClass = await this.prisma.scheduledClass.create({
        data: {
            courseId: course.id,
            date: now,
            startTime: '10:00',
            endTime: '11:00',
        }
    });

    // 4. Create Attendance Session
    const session = await this.prisma.attendanceSession.create({
        data: {
            scheduledClassId: scheduledClass.id,
            status: 'LIVE',
            openedAt: now,
            dynamicQrSecret: Math.random().toString(36).substring(7),
            currentOtp: Math.floor(100000 + Math.random() * 900000).toString(),
        }
    });

    return { success: true, sessionId: session.id };
  }

  async logScan(data: any) {
    const { sessionId, name, type } = data; // the frontend currently sends random names

    // We will just find a random student if name not provided, or search by name
    let student;
    if (name) {
        student = await this.prisma.student.findFirst({
            where: { name: { contains: name } }
        });
    }
    if (!student) {
        student = await this.prisma.student.findFirst(); // fallback
    }

    if (!student || !sessionId) return { success: false, message: 'Missing data' };

    // Check if record exists
    const existing = await this.prisma.attendanceRecord.findUnique({
        where: {
            sessionId_studentId: {
                sessionId,
                studentId: student.id
            }
        }
    });

    if (!existing) {
        await this.prisma.attendanceRecord.create({
            data: {
                sessionId,
                studentId: student.id,
                status: 'PRESENT',
                verifiedByFace: type === 'verified' || type === 'FACE + QR',
                verifiedByOtp: type === 'otp',
                markedAt: new Date()
            }
        });
    }

    return { success: true };
  }
}
