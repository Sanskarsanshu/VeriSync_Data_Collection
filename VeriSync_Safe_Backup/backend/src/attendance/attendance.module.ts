import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { FaceVerificationService } from './face-verification.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService, FaceVerificationService, PrismaService],
})
export class AttendanceModule {}
