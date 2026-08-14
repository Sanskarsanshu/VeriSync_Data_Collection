import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { PrismaService } from '../prisma.service';
import { TeachersController } from './teachers.controller';

@Module({
  providers: [TeachersService, PrismaService],
  controllers: [TeachersController],
})
export class TeachersModule {}
