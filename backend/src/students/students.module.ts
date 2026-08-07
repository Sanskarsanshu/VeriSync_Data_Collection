import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma.service';
import { StudentsController } from './students.controller';

@Module({
  providers: [StudentsService, PrismaService],
  controllers: [StudentsController]
})
export class StudentsModule {}
