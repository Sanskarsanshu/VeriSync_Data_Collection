import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TeacherPortalService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { user: { id: userId } }
    });

    if (!teacher) throw new NotFoundException('Teacher profile not found');

    // Get assigned courses
    const courses = await this.prisma.course.findMany({
      where: { primaryTeacherId: teacher.id },
      include: {
        subject: true,
        section: true
      }
    });

    // Get today's schedule based on timetable rules
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const todayStr = days[new Date().getDay()];

    let todaySchedule = await this.prisma.timetableRule.findMany({
      where: {
        dayOfWeek: todayStr as any,
        course: {
          primaryTeacherId: teacher.id
        }
      },
      include: {
        course: {
          include: { subject: true, section: true }
        }
      },
      orderBy: { startTime: 'asc' }
    });

    // Fallback: If no timetable rules exist in the DB, mock it using the courses the teacher has
    let mappedSchedule = todaySchedule.map(s => ({
      id: s.id,
      startTime: s.startTime,
      endTime: s.endTime,
      roomName: s.room,
      subjectName: s.course.subject.name,
      subjectCode: s.course.subject.code,
      sectionName: s.course.section.name,
      courseId: s.course.id
    }));

    if (mappedSchedule.length === 0 && courses.length > 0) {
      mappedSchedule = courses.map((course, idx) => ({
        id: `mock-schedule-${idx}`,
        startTime: `${9 + idx}:00 AM`,
        endTime: `${10 + idx}:00 AM`,
        roomName: `Room 40${idx + 1}`,
        subjectName: course.subject.name,
        subjectCode: course.subject.code,
        sectionName: course.section.name,
        courseId: course.id
      }));
    }

    return {
      teacherId: teacher.id,
      totalClasses: courses.length,
      todaySchedule: mappedSchedule,
      courses: courses.map(c => ({
        id: c.id,
        subjectName: c.subject.name,
        subjectCode: c.subject.code,
        sectionName: c.section.name,
        capacity: c.section.capacity
      }))
    };
  }
}
