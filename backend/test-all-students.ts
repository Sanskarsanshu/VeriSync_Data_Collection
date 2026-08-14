import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/prisma.service';
import { StudentsService } from './src/students/students.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const studentsService = app.get(StudentsService);

  const users = await prisma.user.findMany({ where: { role: 'STUDENT' } });
  console.log(`Testing ${users.length} students...`);
  
  for (const user of users) {
    let failed = false;
    try {
      await studentsService.getStudentDashboardData(user.id);
    } catch (e) {
      console.log(`Failed Dashboard: ${user.email} -> ${e.message}`);
      failed = true;
    }
    
    try {
      await studentsService.getActiveSession(user.id);
    } catch (e) {
      console.log(`Failed Active Session: ${user.email} -> ${e.message}`);
      failed = true;
    }
    
    try {
      await studentsService.getStudentAttendance(user.id);
    } catch (e) {
      console.log(`Failed Attendance: ${user.email} -> ${e.message}`);
      failed = true;
    }
    
    if (!failed) {
      console.log(`Success: ${user.email}`);
    }
  }

  await app.close();
}

main();
