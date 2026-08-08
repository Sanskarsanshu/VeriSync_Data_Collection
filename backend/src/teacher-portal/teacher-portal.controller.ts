import { Controller, Get, UseGuards, Req } from '@nestjs/common';
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
}
