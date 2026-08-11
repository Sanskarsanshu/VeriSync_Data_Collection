import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CalendarEligibilityService } from './calendar-eligibility.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eligibilityService: CalendarEligibilityService
  ) {}

  @Get('events/:collegeId')
  async getCalendarEvents(@Param('collegeId') collegeId: string) {
    return this.prisma.academicCalendarEvent.findMany({
      where: { calendar: { collegeId, status: 'ACTIVE' } },
      orderBy: { date: 'asc' }
    });
  }

  @Get('eligibility/:courseId')
  async checkEligibility(
    @Param('courseId') courseId: string, 
    @Query('date') dateString: string
  ) {
    const date = new Date(dateString);
    const eligibility = await this.eligibilityService.checkEligibility(courseId, date);
    return {
      courseId,
      date: date.toISOString(),
      eligibility,
      canMarkAttendance: eligibility === 'ELIGIBLE'
    };
  }
}
