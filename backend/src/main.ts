import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  // Auto-seed basic data to prevent empty dropdowns on new deployments
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    
    const semesterCount = await prisma.semester.count();
    if (semesterCount === 0) {
      console.log('Database empty. Auto-seeding initial metadata...');
      
      const sem = await prisma.semester.create({
        data: { term: 1, name: 'Semester I', status: 'ACTIVE' }
      });
      
      const sec = await prisma.section.create({
        data: { code: 'A', name: 'Section A', capacity: 60 }
      });

      // Need minimal hierarchy for a batch
      const col = await prisma.college.create({ data: { code: 'DUMMY', name: 'Dummy College', status: 'ACTIVE' } });
      const dep = await prisma.department.create({ data: { code: 'CS', name: 'Computer Science', collegeId: col.id, status: 'ACTIVE' } });
      const prog = await prisma.programme.create({ data: { code: 'MCA', name: 'MCA', level: 'PG', departmentId: dep.id, status: 'ACTIVE' } });
      const sess = await prisma.academicSession.create({ data: { startDate: new Date('2024-08-01'), endDate: new Date('2025-05-31'), isCurrent: true, programmeId: prog.id, status: 'ACTIVE' } });
      
      await prisma.batch.create({
        data: {
          code: 'MCA-2024-2026',
          name: 'MCA 2024-2026',
          year: 2024,
          status: 'ACTIVE',
          sessionId: sess.id
        }
      });
      
      console.log('Auto-seed complete!');
    }
  } catch (error) {
    console.error('Auto-seed failed (tables might not exist):', error);
  }

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
