import { Module } from '@nestjs/common';
import { TeacherPortalService } from './teacher-portal.service';
import { TeacherPortalController } from './teacher-portal.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TeacherPortalController],
  providers: [TeacherPortalService, PrismaService],
})
export class TeacherPortalModule {}
