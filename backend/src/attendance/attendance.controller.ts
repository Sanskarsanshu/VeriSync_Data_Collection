import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import type { Request as ExpressRequest } from 'express';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('TEACHER')
  @Post('sessions')
  startSession(
    @Request() req: ExpressRequest,
    @Body()
    data: {
      courseId: string;
      verificationMethod: string;
      windowMinutes?: number;
    },
  ) {
    const user = (req as any).user;
    return this.attendanceService.startSession(data, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('TEACHER')
  @Post('sessions/:id/close')
  closeSession(@Request() req: ExpressRequest, @Param('id') sessionId: string) {
    const user = (req as any).user;
    return this.attendanceService.closeSession(sessionId, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions/:id')
  getSessionStatus(@Param('id') sessionId: string) {
    return this.attendanceService.getSessionStatus(sessionId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions/:id/stats')
  getLiveStats(@Param('id') sessionId: string) {
    return this.attendanceService.getLiveStats(sessionId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('STUDENT')
  @Post('sessions/:id/face-verify')
  markFaceAttendance(
    @Param('id') sessionId: string,
    @Body() data: { embedding: number[]; livenessEvidence: any },
  ) {
    return this.attendanceService.markFaceAttendance(sessionId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('STUDENT')
  @Post('sessions/:id/qr-verify')
  markQrAttendance(
    @Param('id') sessionId: string,
    @Body() data: { token: string; studentJwt: string },
  ) {
    return this.attendanceService.markQrAttendance(sessionId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('TEACHER')
  @Post('sessions/:id/manual')
  markManualAttendance(
    @Request() req: ExpressRequest,
    @Param('id') sessionId: string,
    @Body() data: { overrides: Record<string, boolean> },
  ) {
    const user = (req as any).user;
    return this.attendanceService.markManualAttendance(
      sessionId,
      data,
      user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles('TEACHER')
  @Post('sessions/:id/qr/rotate')
  rotateQrToken(
    @Request() req: ExpressRequest,
    @Param('id') sessionId: string,
  ) {
    const user = (req as any).user;
    return this.attendanceService.rotateQrToken(sessionId, user.userId);
  }
}
