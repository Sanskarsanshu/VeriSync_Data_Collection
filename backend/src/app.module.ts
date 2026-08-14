import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { RolesGuard } from './auth/roles.guard';
import { CalendarModule } from './calendar/calendar.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { TimetableModule } from './timetable/timetable.module';
import { AdminModule } from './admin/admin.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { TeachersModule } from './teachers/teachers.module';
import { SubjectsModule } from './subjects/subjects.module';
import { StudentsModule } from './students/students.module';
import { AttendanceModule } from './attendance/attendance.module';
import { TeacherPortalModule } from './teacher-portal/teacher-portal.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CalendarModule,
    AuthModule,
    TimetableModule,
    AdminModule,
    EnrollmentModule,
    TeachersModule,
    SubjectsModule,
    StudentsModule,
    AttendanceModule,
    TeacherPortalModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
