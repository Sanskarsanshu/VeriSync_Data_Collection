import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export enum AttendanceEligibility {
  ELIGIBLE = 'ELIGIBLE',
  CANCELLED = 'CANCELLED',
  HOLIDAY = 'HOLIDAY',
  VACATION = 'VACATION',
  EXAM = 'EXAM',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

@Injectable()
export class CalendarEligibilityService {
  private readonly logger = new Logger(CalendarEligibilityService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates the 10-step precedence engine to determine if attendance
   * can be marked for a specific course on a specific date.
   */
  async checkEligibility(courseId: string, date: Date): Promise<AttendanceEligibility> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { section: { include: { semester: { include: { batch: { include: { session: { include: { programme: { include: { department: true } } } } } } } } } } }
    });

    if (!course) throw new Error('Course not found');
    const collegeId = course.section.semester.batch.session.programme.department.collegeId;

    // 1. Explicitly cancelled classes override everything
    const scheduledClass = await this.prisma.scheduledClass.findFirst({
      where: { courseId, date: { equals: date } }
    });
    if (scheduledClass?.isCancelled) {
      return AttendanceEligibility.CANCELLED;
    }

    // 2. Fetch all relevant calendar events for this college on this date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const events = await this.prisma.academicCalendarEvent.findMany({
      where: {
        calendar: { collegeId, status: 'ACTIVE' },
        date: { gte: startOfDay, lte: endOfDay }
      }
    });

    const isSpecialWorkingDay = events.some(e => e.eventType === 'SPECIAL_WORKING_DAY');

    // 3. Holiday Check (Overrides normal working days unless it's a special working day)
    const isHoliday = events.some(e => e.eventType === 'HOLIDAY');
    if (isHoliday && !isSpecialWorkingDay) {
      return AttendanceEligibility.HOLIDAY;
    }

    // 4. Vacation and Exam Checks
    const isVacation = events.some(e => e.eventType === 'VACATION_START' || e.eventType === 'VACATION_END');
    if (isVacation && !isSpecialWorkingDay) {
      return AttendanceEligibility.VACATION;
    }

    const isExam = events.some(e => e.eventType === 'EXAM_START' || e.eventType === 'EXAM_END');
    if (isExam && !isSpecialWorkingDay) {
      return AttendanceEligibility.EXAM;
    }

    // 5. Weekly Off & Timetable Resolution
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const dayOfWeek = days[date.getDay()];

    const timetableRule = await this.prisma.timetableRule.findFirst({
      where: {
        courseId,
        dayOfWeek: dayOfWeek as any,
        effectiveFrom: { lte: date },
      },
      orderBy: { effectiveFrom: 'desc' }
    });

    if (!timetableRule && !isSpecialWorkingDay) {
      return AttendanceEligibility.NOT_APPLICABLE;
    }

    return AttendanceEligibility.ELIGIBLE;
  }
}
