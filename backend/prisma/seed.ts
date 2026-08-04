import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with VeriSync Phase 1 data...');

  // 1. Create the Admin User
  const adminPasswordHash = await bcrypt.hash('PWC@2025mcaHOD', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'bhawna.mca@patnawomenscollege.in' },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: 'bhawna.mca@patnawomenscollege.in',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      adminProfile: {
        create: {
          name: 'Dr. Bhawna Sinha(HOD)'
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

  // 3.5 Create Teacher Users
  const teachers = [
    { email: 'Richaverma.mca@pwc.in', pass: 'Richa@2025mca', name: 'Richa Verma', empId: 'EMP-001' },
    { email: 'Praveenkumar.mca@pwc.in', pass: 'Praveen@2025mca', name: 'Praveen Kumar', empId: 'EMP-002' },
    { email: 'Sushmitachakraborty.mca@pwc.in', pass: 'Sushmita@2025mca', name: 'Sushmita Chakraborty', empId: 'EMP-003' },
    { email: 'Brajkishoreprasad.mca@pwc.in', pass: 'BKP@2025mca', name: 'Braj Kishore Prasad', empId: 'EMP-004' }
  ];

  for (const t of teachers) {
    const hash = await bcrypt.hash(t.pass, 10);
    const user = await prisma.user.upsert({
      where: { email: t.email },
      update: { passwordHash: hash },
      create: {
        email: t.email,
        passwordHash: hash,
        role: 'TEACHER',
        status: 'ACTIVE',
        teacherProfile: {
          create: {
            name: t.name,
            employeeId: t.empId,
            departmentId: department.id,
            status: 'ACTIVE'
          }
        }
      }
    });
    console.log('Teacher seeded:', user.email);
  }

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
