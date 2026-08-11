import { Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('timetable')
@UseGuards(JwtAuthGuard)
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Roles('TEACHER')
  @Get('my-schedule')
  async getMySchedule(@Request() req, @Query('date') dateString: string) {
    const userId = req.user.userId; // Extracted from JWT
    const date = dateString ? new Date(dateString) : new Date();

    return this.timetableService.getTeacherSchedule(userId, date);
  }
}
