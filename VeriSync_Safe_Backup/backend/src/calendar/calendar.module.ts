import { Module } from '@nestjs/common';
import { CalendarEligibilityService } from './calendar-eligibility.service';
import { CalendarController } from './calendar.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CalendarController],
  providers: [CalendarEligibilityService, PrismaService],
  exports: [CalendarEligibilityService],
})
export class CalendarModule {}
