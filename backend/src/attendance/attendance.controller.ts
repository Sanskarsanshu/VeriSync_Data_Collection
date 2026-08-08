import { Controller, Post, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('start')
  startSession(@Body() data: any) {
    return this.attendanceService.startSession(data);
  }

  @Post('mark')
  markAttendance(@Body() data: { sessionId: string; studentId: string; otp?: string; token?: string }) {
    return this.attendanceService.markAttendance(data);
  }

  @Post('live-stats')
  getLiveStats(@Body() data: { sessionId: string }) {
    return this.attendanceService.getLiveStats(data.sessionId);
  }
}
