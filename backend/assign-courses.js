const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mappings = [
  {
    semester: 1,
    subjects: [
      { code: "CC101", primary: "Richaverma.mca@pwc.in" },
      { code: "CC102", primary: "Praveenkumar.mca@pwc.in" },
      { code: "CC103", primary: "Richaverma.mca@pwc.in" },
      { code: "CC104", primary: "Brajkishoreprasad.mca@pwc.in" },
      { code: "CC105", primary: "Praveenkumar.mca@pwc.in" },
      { code: "SEC101", primary: "bhawnasinha@pwc.in" },
    ]
  },
  {
    semester: 3,
    subjects: [
      { code: "CC310", primary: "Praveenkumar.mca@pwc.in" },
      { code: "CC311", primary: "Brajkishoreprasad.mca@pwc.in" },
      { code: "CC312", primary: "Sushmitachakraborty.mca@pwc.in" },
      { code: "CC313", primary: "Praveenkumar.mca@pwc.in" }, // Making Praveen primary for Lab
      { code: "MDC302", primary: "Richaverma.mca@pwc.in" },
    ]
  }
];

// For simplicity, we are only mapping PRIMARY teachers to the Course model
// since our current Course model only supports `primaryTeacherId` directly.
// (Co-teachers would require a join table or array, which might not be in the schema).

async function main() {
  console.log('Updating courses...');
  
  const section = await prisma.section.findFirst();
  if (!section) {
    console.error('No section found in DB.');
    process.exit(1);
  }

  for (const sem of mappings) {
    for (const sub of sem.subjects) {
      const user = await prisma.user.findUnique({
        where: { email: sub.primary },
        include: { teacherProfile: true }
      });

      if (!user || !user.teacherProfile) {
        console.warn(`Teacher ${sub.primary} not found!`);
        continue;
      }

      const subject = await prisma.subject.findUnique({
        where: { code: sub.code }
      });

      if (!subject) continue;

      const existingCourse = await prisma.course.findFirst({
        where: { subjectId: subject.id, sectionId: section.id }
      });

      if (existingCourse) {
        await prisma.course.update({
          where: { id: existingCourse.id },
          data: { primaryTeacherId: user.teacherProfile.id }
        });
      } else {
        await prisma.course.create({
          data: {
            subjectId: subject.id,
            sectionId: section.id,
            primaryTeacherId: user.teacherProfile.id,
            status: 'ACTIVE'
          }
        });
      }
      console.log(`Assigned ${sub.code} to ${sub.primary}`);
    }
  }
  console.log('All subjects assigned successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
