import { Controller, Get, Delete, Param, Post, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import type { Request } from 'express';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me/dashboard')
  getDashboardData(@Req() req: Request) {
    const jwtUser = (req as any).user;
    return this.studentsService.getStudentDashboardData(jwtUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/courses')
  getCourses(@Req() req: Request) {
    const jwtUser = (req as any).user;
    return this.studentsService.getStudentCourses(jwtUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/attendance')
  getAttendance(@Req() req: Request) {
    const jwtUser = (req as any).user;
    return this.studentsService.getStudentAttendance(jwtUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/timetable')
  getTimetable(@Req() req: Request) {
    const jwtUser = (req as any).user;
    return this.studentsService.getStudentTimetable(jwtUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/active-session')
  getActiveSession(@Req() req: Request) {
    const jwtUser = (req as any).user;
    return this.studentsService.getActiveSession(jwtUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/mark-attendance/:sessionId')
  markAttendance(@Param('sessionId') sessionId: string, @Req() req: Request) {
    const jwtUser = (req as any).user;
    return this.studentsService.markTestAttendance(jwtUser.userId, sessionId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/analytics')
  getAnalytics(@Req() req: Request) {
    const jwtUser = (req as any).user;
    return this.studentsService.getStudentAnalytics(jwtUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/profile')
  getProfile(@Req() req: Request) {
    const jwtUser = (req as any).user;
    return this.studentsService.getStudentProfile(jwtUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/profile/photo')
  updateProfilePhoto(@Req() req: Request, @Body() body: { photoUrl: string }) {
    const jwtUser = (req as any).user;
    return this.studentsService.updateProfilePhoto(jwtUser.userId, body.photoUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() data: any) {
    return this.studentsService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.studentsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}

