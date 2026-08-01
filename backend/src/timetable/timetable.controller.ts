import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { TimetableService } from './timetable.service';

@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get('my-schedule')
  async getMySchedule(@Request() req, @Query('date') dateString: string) {
    const teacherId = req.user.userId; // Extracted from JWT
    const date = dateString ? new Date(dateString) : new Date();
    
    return this.timetableService.getTeacherSchedule(teacherId, date);
  }
}
