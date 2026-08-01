import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with VeriSync Phase 1 data...');

  // 1. Create the Admin User
  const adminPasswordHash = await bcrypt.hash('Admin@81029', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'sanskriti81029@gmail.com' },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: 'sanskriti81029@gmail.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      adminProfile: {
        create: {
          name: 'Sanskriti (System Admin)'
        }
      }
    }
  });
  console.log('Admin user seeded:', adminUser.email);

  // 2. Institutional Hierarchy: College
  const college = await prisma.college.upsert({
    where: { code: 'PWC' },
    update: {},
    create: {
      name: "Patna Women's College",
      code: 'PWC',
      status: 'ACTIVE',
    }
  });

  // 3. Department
  const department = await prisma.department.upsert({
    where: { code: 'MCA-DEPT' },
    update: {},
    create: {
      name: 'Department of Computer Applications',
      code: 'MCA-DEPT',
      collegeId: college.id,
      status: 'ACTIVE',
    }
  });

  // 4. Programme
  const programme = await prisma.programme.upsert({
    where: { shortName: 'MCA' },
    update: {},
    create: {
      name: 'Master of Computer Applications',
      shortName: 'MCA',
      durationYears: 2,
      totalSemesters: 4,
      departmentId: department.id,
      status: 'ACTIVE',
    }
  });

  // 5. Academic Session
  const session = await prisma.academicSession.create({
    data: {
      startYear: 2025,
      endYear: 2027,
      programmeId: programme.id,
      status: 'ACTIVE',
    }
  });

  // 6. Batch & Semester
  const batch = await prisma.batch.create({
    data: {
      name: '2025-2027 Cohort',
      sessionId: session.id,
      status: 'ACTIVE',
    }
  });

  const semester = await prisma.semester.create({
    data: {
      semesterNumber: 3,
      batchId: batch.id,
      startDate: new Date('2026-07-01T00:00:00Z'),
      endDate: new Date('2026-11-15T00:00:00Z'),
      status: 'ACTIVE',
    }
  });

  const section = await prisma.section.create({
    data: {
      name: 'Section A',
      capacity: 50,
      semesterId: semester.id,
      status: 'ACTIVE',
    }
  });

  // 7. Academic Calendar 2026-2027
  const calendar = await prisma.academicCalendar.create({
    data: {
      name: "Academic Calendar 2026-2027",
      collegeId: college.id,
      startDate: new Date('2026-06-01T00:00:00Z'),
      endDate: new Date('2026-05-31T23:59:59Z'),
      status: 'ACTIVE',
    }
  });

  // 8. Sample Calendar Events for July-August 2026
  await prisma.academicCalendarEvent.createMany({
    data: [
      {
        calendarId: calendar.id,
        eventType: 'VACATION_END',
        name: 'Summer Vacation Ends',
        date: new Date('2026-06-30T00:00:00Z'),
      },
      {
        calendarId: calendar.id,
        eventType: 'HOLIDAY',
        name: 'Independence Day',
        date: new Date('2026-08-15T00:00:00Z'),
      }
    ]
  });

  console.log('Institutional data and Academic Calendar seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
