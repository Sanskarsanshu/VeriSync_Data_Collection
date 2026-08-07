import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

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
      }
    });

    return students.map((s, i) => {
      return {
        id: s.id,
        name: s.name,
        roll: s.rollNumber,
        course: 'EC202', // Mocked as we don't have this in student model
        examRoll: s.registrationNumber ? s.registrationNumber.replace('PWC', 'EXAM') : '',
        regNo: s.registrationNumber || '',
        session: `${s.batch.session.startYear}-${s.batch.session.endYear}`,
        classText: `MCA, ${s.section.name}`,
        color: AVATAR_COLORS[i % AVATAR_COLORS.length],
        status: s.status === 'ACTIVE' ? 'ACTIVE' : 'WARNING',
        verification: s.status === 'ACTIVE' ? 'Verified' : 'Not verified',
        time: '09:00 AM',
        faceEnrolled: true,
        attendance: 85,
        monthly: {}, // Handled by frontend mock generator or backend later
        matrix: {},
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
      id: user.studentProfile.id,
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

