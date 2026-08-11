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

  // 3.8 Subjects
  const subjectsData = [
    // Semester 1
    { code: 'CC101', name: 'Software Engineering', credits: 5, isPractical: false },
    { code: 'CC102', name: 'Advanced Database Management System', credits: 5, isPractical: true },
    { code: 'CC103', name: 'Design & Analysis of Algorithm', credits: 5, isPractical: false },
    { code: 'CC104', name: 'Data Communications & Computer Networks', credits: 5, isPractical: true },
    { code: 'CC105', name: 'Python Programming', credits: 5, isPractical: true },
    { code: 'SEC101', name: 'Data Visualization', credits: 3, isPractical: true },
    { code: 'MAEC101', name: 'Environmental Sustainability', credits: 5, isPractical: true },

    // Semester 2
    { code: 'CC206', name: 'Web Technology using .NET', credits: 5, isPractical: true },
    { code: 'CC207', name: 'Data & Web Mining', credits: 5, isPractical: false },
    { code: 'CC208', name: 'Artificial Intelligence and Machine Learning', credits: 5, isPractical: true },
    { code: 'CC209', name: 'Mini Project I (Lab)', credits: 3, isPractical: true },
    { code: 'MDC201', name: 'Optimization Techniques', credits: 5, isPractical: false },
    { code: 'DSE201', name: 'Elective-1', credits: 5, isPractical: false },
    { code: 'SEC202', name: 'Statistical Analysis using R', credits: 3, isPractical: true },

    // Semester 3
    { code: 'CC310', name: 'Advanced Web Designing using J2EE', credits: 5, isPractical: true },
    { code: 'CC311', name: 'Cloud Computing', credits: 5, isPractical: false },
    { code: 'CC312', name: 'Big Data Analytics', credits: 5, isPractical: false },
    { code: 'CC313', name: 'Mini Project II (Lab)', credits: 3, isPractical: true },
    { code: 'MDC302', name: 'Digital Marketing and E-Commerce', credits: 5, isPractical: false },
    { code: 'MAEC302', name: 'Human Values & Professional Ethics', credits: 5, isPractical: true },
    { code: 'SEC303', name: 'Industrial Visit and Technical Report Writing', credits: 3, isPractical: true },

    // Semester 4
    { code: 'DSE402', name: 'MOOCs', credits: 5, isPractical: false },
    { code: 'CC414', name: 'OJT and Project Dissertation', credits: 22, isPractical: true },
    { code: 'SEC404', name: 'Industrial Training and Internship', credits: 3, isPractical: true },
  ];

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

  // Create Subjects linked to Programme
  for (const sub of subjectsData) {
    await prisma.subject.upsert({
      where: { code: sub.code },
      update: {},
      create: {
        code: sub.code,
        name: sub.name,
        credits: sub.credits,
        isPractical: sub.isPractical,
        programmeId: programme.id,
      }
    });
  }

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

  // 6.5 Students
  const RAW_STUDENTS = [
    {name:'Ananya Singh',  roll:'MCA030', email: 'ananya.mca@pwc.in'},
    {name:'Garima Gupta',  roll:'MCA031', email: 'garima.mca@pwc.in'},
    {name:'Harshita Jha',  roll:'MCA032', email: 'harshita.mca@pwc.in'},
    {name:'Komal Kumari',  roll:'MCA033', email: 'komal.mca@pwc.in'},
    {name:'Mahi Verma',    roll:'MCA034', email: 'mahi.mca@pwc.in'},
    {name:'Neha Sinha',    roll:'MCA035', email: 'neha.mca@pwc.in'},
    {name:'Pallavi Roy',   roll:'MCA036', email: 'pallavi.mca@pwc.in'},
    {name:'Pooja Sharma',  roll:'MCA037', email: 'pooja.mca@pwc.in'},
    {name:'Riya Kumari',   roll:'MCA038', email: 'riya.mca@pwc.in'},
  ];

  for (const s of RAW_STUDENTS) {
    const hash = await bcrypt.hash('Welcome@123', 10);
    const examRoll = '25' + s.roll.replace('MCA', 'MCA0');
    const regNo = '25PWC0' + s.roll.replace(/[^0-9]/g, '');
    
    await prisma.user.upsert({
      where: { email: s.email },
      update: { passwordHash: hash },
      create: {
        email: s.email,
        passwordHash: hash,
        role: 'STUDENT',
        status: 'ACTIVE',
        studentProfile: {
          create: {
            name: s.name,
            rollNumber: s.roll,
            registrationNumber: regNo,
            batchId: batch.id,
            sectionId: section.id,
            status: 'ACTIVE',
            profile: {
              create: {
                admissionYear: 2025,
                expectedGraduationYear: 2027
              }
            }
          }
        }
      }
    });
    console.log('Student seeded:', s.email);
  }

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
