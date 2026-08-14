import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CalendarEligibilityService } from '../calendar/calendar-eligibility.service';

@Injectable()
export class TimetableService {
  constructor(
    private prisma: PrismaService,
    private eligibilityService: CalendarEligibilityService,
  ) {}

  async getTeacherSchedule(userId: string, date: Date) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { user: { id: userId } },
    });
    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }
    const teacherId = teacher.id;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const days = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];
    const dayOfWeek = days[date.getDay()];

    // 1. Get explicit scheduled classes for this date
    const explicitlyScheduled = await this.prisma.scheduledClass.findMany({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        course: { primaryTeacherId: teacherId },
      },
      include: { course: { include: { subject: true, section: true } } },
    });

    // 2. Get recurring timetable rules
    const recurringRules = await this.prisma.timetableRule.findMany({
      where: {
        dayOfWeek: dayOfWeek as any,
        effectiveFrom: { lte: date },
        course: { primaryTeacherId: teacherId },
      },
      include: { course: { include: { subject: true, section: true } } },
    });

    const combinedSchedule: any[] = [];

    // Combine logic (Explicit overrides recurring)
    for (const rule of recurringRules) {
      const explicitOverride = explicitlyScheduled.find(
        (es) =>
          es.courseId === rule.courseId && es.startTime === rule.startTime,
      );

      if (explicitOverride) {
        if (!explicitOverride.isCancelled) {
          combinedSchedule.push(explicitOverride);
        }
      } else {
        // Check calendar eligibility (is it a holiday?)
        const eligibility = await this.eligibilityService.checkEligibility(
          rule.courseId,
          date,
        );
        if (eligibility === 'ELIGIBLE') {
          combinedSchedule.push({
            id: 'virtual-' + rule.id,
            courseId: rule.courseId,
            date,
            startTime: rule.startTime,
            endTime: rule.endTime,
            isCancelled: false,
            isHoliday: false,
            course: rule.course,
          });
        }
      }
    }

    // Add any explicit classes that weren't in the recurring timetable
    for (const explicit of explicitlyScheduled) {
      if (
        !explicit.isCancelled &&
        !combinedSchedule.find(
          (s) =>
            s.courseId === explicit.courseId &&
            s.startTime === explicit.startTime,
        )
      ) {
        combinedSchedule.push(explicit);
      }
    }

    return combinedSchedule;
  }
}
