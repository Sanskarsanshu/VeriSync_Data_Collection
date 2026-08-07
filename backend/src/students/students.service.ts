import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

const AVATAR_COLORS = ['#2F6F5E','#B4517A','#5B6FD6','#C77B3B','#3F8FBF','#7A5FBF','#4E8B5A'];

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const students = await this.prisma.student.findMany({
      include: {
        batch: { include: { session: true } },
        section: true,
        user: true,
        attendanceRecords: {
          include: { session: { include: { scheduledClass: { include: { course: { include: { subject: true } } } } } } }
        }
      }
    });

    const MONTHS = ['July','June','May','April','March','February','January'];
    const DAY_COLS = Array.from({length:30}, (_,i)=>String(i+1).padStart(2,'0'));

    return students.map((s, i) => {
      // 1. Build Monthly
      const monthly: any = {};
      MONTHS.forEach(m => monthly[m] = { present: 0, absent: 100 }); // Default 0% present if no data
      
      let totalPresent = 0;
      let totalRecords = 0;

      const recordsByMonth: Record<string, { p: number, a: number }> = {};
      MONTHS.forEach(m => recordsByMonth[m] = { p: 0, a: 0 });

      const matrix: any = {};

      s.attendanceRecords.forEach(record => {
          totalRecords++;
          if (record.status === 'PRESENT') totalPresent++;

          const date = record.markedAt;
          const monthName = date.toLocaleString('default', { month: 'long' });
          if (recordsByMonth[monthName]) {
              if (record.status === 'PRESENT') recordsByMonth[monthName].p++;
              else recordsByMonth[monthName].a++;
          }

          const courseCode = record.session.scheduledClass.course.subject.code;
          if (!matrix[courseCode]) matrix[courseCode] = {};
          if (!matrix[courseCode][monthName]) {
              matrix[courseCode][monthName] = Array(30).fill('0');
          }
          const dayIndex = Math.min(date.getDate() - 1, 29);
          matrix[courseCode][monthName][dayIndex] = record.status === 'PRESENT' ? '1' : '0';
      });

      MONTHS.forEach(m => {
          const stats = recordsByMonth[m];
          const total = stats.p + stats.a;
          if (total > 0) {
              monthly[m] = { present: Math.round((stats.p / total) * 100), absent: Math.round((stats.a / total) * 100) };
          }
      });

      const overallAttendance = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;

      // Fallback matrix layout so UI doesn't crash if empty
      if (Object.keys(matrix).length === 0) {
          matrix['CC101'] = {};
          MONTHS.forEach(m => matrix['CC101'][m] = Array(30).fill('0'));
      }

      return {
        id: s.id,
        name: s.name,
        roll: s.rollNumber,
        course: 'EC202', // Mocked as we don't have this in student model directly mapped
        examRoll: s.registrationNumber ? s.registrationNumber.replace('PWC', 'EXAM') : '',
        regNo: s.registrationNumber || '',
        session: s.batch && s.batch.session ? `${s.batch.session.startYear}-${s.batch.session.endYear}` : '2025-27',
        classText: s.section ? `MCA, ${s.section.name}` : 'MCA',
        color: AVATAR_COLORS[i % AVATAR_COLORS.length],
        status: s.status === 'ACTIVE' ? 'ACTIVE' : 'WARNING',
        verification: s.status === 'ACTIVE' ? 'Verified' : 'Not verified',
        time: '09:00 AM',
        faceEnrolled: true,
        attendance: overallAttendance,
        monthly,
        matrix,
      };
    });
  }

  async create(data: any) {
    const passwordHash = await bcrypt.hash('Welcome@123', 10);
    const batch = await this.prisma.batch.findFirst();
    const section = await this.prisma.section.findFirst();

    const user = await this.prisma.user.create({
      data: {
        email: data.email || `${data.roll?.toLowerCase() || Date.now()}@pwc.in`,
        passwordHash,
        role: 'STUDENT',
        status: data.status === 'ACTIVE' ? 'ACTIVE' : 'PENDING',
        studentProfile: {
          create: {
            batchId: batch?.id || '',
            sectionId: section?.id || '',
            rollNumber: data.roll,
            registrationNumber: data.regNo,
            name: data.name,
            status: data.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
          }
        }
      },
      include: { studentProfile: true }
    });

    return {
      id: user.studentProfile?.id || user.id,
      name: data.name,
      roll: data.roll,
      course: data.course || 'CC101',
      examRoll: data.examRoll,
      regNo: data.regNo,
      session: data.session || '2025-27',
      classText: data.classText || 'MCA',
      color: data.color || '#3b82f6',
      status: data.status,
      verification: data.verification || 'Not verified',
      time: '—',
      faceEnrolled: false,
      attendance: 0
    };
  }

  async update(id: string, data: any) {
    const student = await this.prisma.student.update({
      where: { id },
      data: {
        name: data.name,
        rollNumber: data.roll,
        registrationNumber: data.regNo,
        status: data.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'
      },
      include: { user: true }
    });

    if (data.status) {
      await this.prisma.user.update({
        where: { id: student.userId },
        data: { status: data.status === 'ACTIVE' ? 'ACTIVE' : 'PENDING' }
      });
    }

    return {
      id,
      name: data.name || student.name,
      roll: data.roll || student.rollNumber,
      regNo: data.regNo || student.registrationNumber,
      status: data.status,
      // Fallbacks so frontend store merges correctly
      course: data.course,
      examRoll: data.examRoll,
      session: data.session,
      classText: data.classText,
      verification: data.verification
    };
  }

  async remove(id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (student) {
      await this.prisma.user.delete({ where: { id: student.userId } });
    }
    return { success: true };
  }
}

