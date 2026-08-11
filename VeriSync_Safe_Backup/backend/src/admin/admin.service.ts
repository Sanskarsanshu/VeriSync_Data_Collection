import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalStudents, totalTeachers, activeCourses, liveSessions] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.teacher.count(),
      this.prisma.course.count({ where: { status: 'ACTIVE' } }),
      this.prisma.attendanceSession.count({ where: { status: 'LIVE' } }),
    ]);

    return {
      totalStudents,
      totalTeachers,
      activeCourses,
      liveSessions,
    };
  }
}
