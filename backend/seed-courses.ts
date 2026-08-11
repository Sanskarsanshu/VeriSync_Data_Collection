import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding courses and timetable rules...');
  
  // Get existing section
  const section = await prisma.section.findFirst({ where: { name: 'Section A' } });
  if (!section) throw new Error("Section not found");

  // Update Teachers
  const teacherUpdates = [
    { email: 'Richaverma.mca@pwc.in', name: 'Richa Verma', empId: 'RV' },
    { email: 'Praveenkumar.mca@pwc.in', name: 'Dr. Praveen Kumar', empId: 'PK' },
    { email: 'Sushmitachakraborty.mca@pwc.in', name: 'Dr. Sushmita Chakraborty', empId: 'SC' },
    { email: 'Brajkishoreprasad.mca@pwc.in', name: 'Mr. Braj Kishore Prasad', empId: 'BKP' }
  ];

  for (const t of teacherUpdates) {
    const user = await prisma.user.findUnique({ where: { email: t.email } });
    if (user) {
      await prisma.teacher.update({
        where: { userId: user.id },
        data: { name: t.name, employeeId: t.empId }
      });
    }
  }

  const teacherMap = {
    'RV': await prisma.teacher.findFirst({ where: { employeeId: 'RV' } }),
    'PK': await prisma.teacher.findFirst({ where: { employeeId: 'PK' } }),
    'SC': await prisma.teacher.findFirst({ where: { employeeId: 'SC' } }),
    'BKP': await prisma.teacher.findFirst({ where: { employeeId: 'BKP' } }),
    'BS': await prisma.teacher.findFirst({ where: { user: { email: 'bhawna.mca@patnawomenscollege.in' } } })
  };

  const getSubId = async (code: string) => {
    const sub = await prisma.subject.findUnique({ where: { code } });
    if (!sub) throw new Error("Subject not found: " + code);
    return sub.id;
  };

  const coursesData = [
    { sub: 'CC310', tCode: 'PK' },
    { sub: 'CC311', tCode: 'BKP' },
    { sub: 'CC312', tCode: 'SC' },
    { sub: 'CC313', tCode: 'BS' }, // Mini project primary teacher
    { sub: 'MDC302', tCode: 'RV' },
  ];

  const courseIds: Record<string, string> = {};

  for (const c of coursesData) {
    let course = await prisma.course.findFirst({
      where: { subjectId: await getSubId(c.sub), sectionId: section.id }
    });
    
    if (!course) {
      course = await prisma.course.create({
        data: {
          subjectId: await getSubId(c.sub),
          sectionId: section.id,
          primaryTeacherId: teacherMap[c.tCode as keyof typeof teacherMap]!.id,
          status: 'ACTIVE'
        }
      });
    }
    courseIds[c.sub] = course.id;
  }

  // Clear existing rules for these courses just in case
  for (const cId of Object.values(courseIds)) {
    await prisma.timetableRule.deleteMany({ where: { courseId: cId } });
  }

  // Monday Schedule
  const rules = [
    { day: 'MONDAY', sub: 'CC310', start: '09:15', end: '10:10' },
    { day: 'MONDAY', sub: 'CC312', start: '10:10', end: '11:05' },
    { day: 'MONDAY', sub: 'CC311', start: '11:05', end: '12:00' },
    { day: 'MONDAY', sub: 'CC310', start: '12:00', end: '12:55' },
    { day: 'MONDAY', sub: 'CC313', start: '13:25', end: '14:20' },
    { day: 'MONDAY', sub: 'CC313', start: '14:20', end: '15:15' },
    
    // Tuesday Schedule
    { day: 'TUESDAY', sub: 'CC311', start: '09:15', end: '10:10' },
    { day: 'TUESDAY', sub: 'CC312', start: '10:10', end: '11:05' },
    { day: 'TUESDAY', sub: 'MDC302', start: '11:05', end: '12:00' },
    { day: 'TUESDAY', sub: 'CC313', start: '12:00', end: '12:55' },
    { day: 'TUESDAY', sub: 'CC313', start: '13:25', end: '14:20' },
    
    // Wednesday Schedule
    { day: 'WEDNESDAY', sub: 'MDC302', start: '09:15', end: '10:10' },
    { day: 'WEDNESDAY', sub: 'CC312', start: '10:10', end: '11:05' },
    { day: 'WEDNESDAY', sub: 'CC310', start: '11:05', end: '12:00' },
    { day: 'WEDNESDAY', sub: 'CC310', start: '12:00', end: '12:55' },

    // Thursday Schedule
    { day: 'THURSDAY', sub: 'MDC302', start: '09:15', end: '10:10' },
    { day: 'THURSDAY', sub: 'CC311', start: '10:10', end: '11:05' },
    { day: 'THURSDAY', sub: 'CC310', start: '11:05', end: '12:00' },
    { day: 'THURSDAY', sub: 'CC310', start: '12:00', end: '12:55' },

    // Friday Schedule
    { day: 'FRIDAY', sub: 'MDC302', start: '09:15', end: '10:10' },
    { day: 'FRIDAY', sub: 'CC310', start: '10:10', end: '11:05' }, 
    { day: 'FRIDAY', sub: 'CC312', start: '11:05', end: '12:00' },
    { day: 'FRIDAY', sub: 'CC311', start: '12:00', end: '12:55' },
  ];

  for (const r of rules) {
    await prisma.timetableRule.create({
      data: {
        courseId: courseIds[r.sub],
        dayOfWeek: r.day as any,
        startTime: r.start,
        endTime: r.end,
        effectiveFrom: new Date('2026-07-01T00:00:00Z'),
      }
    });
  }

  console.log('Courses and timetable rules seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
