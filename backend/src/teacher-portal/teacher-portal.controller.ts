import { Controller, Get, UseGuards, Req, Param, Query } from '@nestjs/common';
import { TeacherPortalService } from './teacher-portal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('teacher-portal')
@UseGuards(JwtAuthGuard)
export class TeacherPortalController {
  constructor(private readonly teacherPortalService: TeacherPortalService) {}

  @Get('dashboard')
  getDashboard(@Req() req: Request) {
    const user = (req as any).user;
    return this.teacherPortalService.getDashboard(user.userId);
  }

  @Get('courses/:courseId/students')
  getCourseStudents(@Req() req: Request, @Param('courseId') courseId: string) {
    const user = (req as any).user;
    return this.teacherPortalService.getCourseStudents(user.userId, courseId);
  }

  @Get('courses/:courseId/attendance-sheet')
  getAttendanceSheet(
    @Req() req: Request,
    @Param('courseId') courseId: string,
    @Query('month') monthName: string
  ) {
    const user = (req as any).user;
    return this.teacherPortalService.getAttendanceSheet(user.userId, courseId, monthName);
  }
}
