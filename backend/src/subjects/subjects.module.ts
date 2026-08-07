import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { PrismaService } from '../prisma.service';
import { SubjectsController } from './subjects.controller';

@Module({
  providers: [SubjectsService, PrismaService],
  controllers: [SubjectsController]
})
export class SubjectsModule {}
