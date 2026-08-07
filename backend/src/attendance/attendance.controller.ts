import { Controller, Post, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('simulate-class')
  simulateClass(@Body() data: any) {
    return this.attendanceService.simulateClass(data);
  }

  @Post('log-scan')
  logScan(@Body() data: any) {
    return this.attendanceService.logScan(data);
  }
}
