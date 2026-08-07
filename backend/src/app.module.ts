import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CalendarModule } from './calendar/calendar.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { TimetableModule } from './timetable/timetable.module';
import { AdminModule } from './admin/admin.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { TeachersModule } from './teachers/teachers.module';
import { SubjectsModule } from './subjects/subjects.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [CalendarModule, AuthModule, TimetableModule, AdminModule, EnrollmentModule, TeachersModule, SubjectsModule, StudentsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
