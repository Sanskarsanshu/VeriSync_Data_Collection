import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { StudentsService } from './src/students/students.service';
import { PrismaService } from './src/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const studentsService = app.get(StudentsService);
  const prisma = app.get(PrismaService);

  const student = await prisma.student.findFirst({
    include: { user: true }
  });

  if (!student || !student.user) {
    console.log("No student found");
    await app.close();
    return;
  }

  console.log("Testing with student user ID:", student.user.id);
  
  try {
    console.log("Running getStudentDashboardData...");
    const data = await studentsService.getStudentDashboardData(student.user.id);
    console.log("Dashboard SUCCESS");
  } catch (e) {
    console.error("Dashboard Error:", e.message);
    console.error(e.stack);
  }

  try {
    console.log("Running getActiveSession...");
    const active = await studentsService.getActiveSession(student.user.id);
    console.log("Active Session SUCCESS");
  } catch (e) {
    console.error("Active Session Error:", e.message);
  }

  try {
    console.log("Running getStudentAttendance...");
    const attendance = await studentsService.getStudentAttendance(student.user.id);
    console.log("Attendance SUCCESS");
  } catch (e) {
    console.error("Attendance Error:", e.message);
  }
  
  await app.close();
}
bootstrap();
