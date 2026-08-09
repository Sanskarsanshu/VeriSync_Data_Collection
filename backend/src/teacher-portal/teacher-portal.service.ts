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

    let mappedSchedule = todaySchedule.map(s => ({
      id: s.id,
      startTime: s.startTime,
      endTime: s.endTime,
      roomName: s.room || 'TBA',
      subjectName: s.course.subject.name,
      subjectCode: s.course.subject.code,
      sectionName: s.course.section.name,
      courseId: s.course.id
    }));

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

  async getCourseStudents(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { section: true }
    });

    if (!course) throw new NotFoundException('Course not found');

    const students = await this.prisma.student.findMany({
      where: { sectionId: course.sectionId, status: 'ACTIVE' },
      include: { profile: true },
      orderBy: { rollNumber: 'asc' }
    });

    return students.map(s => ({
      id: s.id,
      rollNumber: s.rollNumber,
      name: s.name,
      photoUrl: s.profile?.photoUrl || null
    }));
  }

  async getAttendanceSheet(courseId: string, monthName: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { section: true, subject: true }
    });

    if (!course) throw new NotFoundException('Course not found');

    // Parse month (e.g. "August" to month index)
    const monthIndex = new Date(`${monthName} 1, 2026`).getMonth();
    const startDate = new Date(2026, monthIndex, 1);
    const endDate = new Date(2026, monthIndex + 1, 0, 23, 59, 59);

    const students = await this.prisma.student.findMany({
      where: { sectionId: course.sectionId, status: 'ACTIVE' },
      orderBy: { rollNumber: 'asc' }
    });

    // Get all sessions for this course in the month
    const sessions = await this.prisma.attendanceSession.findMany({
      where: {
        scheduledClass: {
          courseId: course.id,
          date: { gte: startDate, lte: endDate }
        }
      },
      include: { scheduledClass: true, records: true }
    });

    const daysInMonth = endDate.getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const attendanceData = students.map(student => {
      const studentDays = daysArray.map(day => {
        // Find session for this day
        const daySession = sessions.find(s => s.scheduledClass.date.getDate() === day);
        if (!daySession) return '-'; // No class

        const record = daySession.records.find(r => r.studentId === student.id);
        if (!record) return 'A'; // Has class but no record -> Absent
        if (record.status === 'PRESENT') return 'P';
        if (record.status === 'LATE') return 'L';
        return 'A';
      });

      return {
        id: student.id,
        roll: student.rollNumber,
        name: student.name,
        attendance: studentDays
      };
    });

    return {
      courseName: course.subject.name,
      month: monthName,
      daysInMonth,
      students: attendanceData
    };
  }
}
