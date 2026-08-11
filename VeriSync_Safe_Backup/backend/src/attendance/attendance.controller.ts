import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('sessions')
  startSession(@Body() data: { courseId: string; verificationMethod: string; windowMinutes?: number; teacherId: string }) {
    return this.attendanceService.startSession(data);
  }

  @Post('sessions/:id/close')
  closeSession(@Param('id') sessionId: string, @Body() data: { teacherId: string }) {
    return this.attendanceService.closeSession(sessionId, data.teacherId);
  }

  @Get('sessions/:id')
  getSessionStatus(@Param('id') sessionId: string) {
    return this.attendanceService.getSessionStatus(sessionId);
  }

  @Get('sessions/:id/stats')
  getLiveStats(@Param('id') sessionId: string) {
    return this.attendanceService.getLiveStats(sessionId);
  }

  @Post('sessions/:id/face-verify')
  markFaceAttendance(
    @Param('id') sessionId: string,
    @Body() data: { embedding: number[]; livenessEvidence: any }
  ) {
    return this.attendanceService.markFaceAttendance(sessionId, data);
  }

  @Post('sessions/:id/qr-verify')
  markQrAttendance(
    @Param('id') sessionId: string,
    @Body() data: { token: string; studentJwt: string }
  ) {
    return this.attendanceService.markQrAttendance(sessionId, data);
  }

  @Post('sessions/:id/manual')
  markManualAttendance(
    @Param('id') sessionId: string,
    @Body() data: { overrides: Record<string, boolean>; teacherId: string }
  ) {
    return this.attendanceService.markManualAttendance(sessionId, data);
  }

  @Post('sessions/:id/qr/rotate')
  rotateQrToken(@Param('id') sessionId: string, @Body() data: { teacherId: string }) {
    return this.attendanceService.rotateQrToken(sessionId, data.teacherId);
  }
}
