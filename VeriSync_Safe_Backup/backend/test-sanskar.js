require('dotenv').config({ path: __dirname + '/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'sanskar97716@gmail.com' },
  });

  if (!user) return console.log("User not found");

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    include: {
      user: true,
      profile: true,
      batch: true,
      section: {
        include: {
          semester: true
        }
      }
    }
  });

  if (!student) return console.log('Student not found');

  try {
    const profile = {
      name: student.name,
      rollNumber: student.rollNumber,
      email: student.user?.email || student.profile?.email || 'Not provided',
      mobileNumber: student.profile?.mobileNumber || 'Not provided',
      dob: student.profile?.dob ? student.profile.dob.toISOString().split('T')[0] : 'Not provided',
      gender: student.profile?.gender || 'Not specified',
      bloodGroup: student.profile?.bloodGroup || 'Not specified',
      photoUrl: student.profile?.photoUrl || null,
      admissionYear: student.profile?.admissionYear || new Date().getFullYear(),
      expectedGraduationYear: student.profile?.expectedGraduationYear || (new Date().getFullYear() + 4),
      batch: student.batch?.name || 'Unassigned Batch',
      semester: student.section?.semester ? `Semester ${student.section.semester.semesterNumber}` : 'Unassigned Semester',
      section: student.section?.name || 'Unassigned Section',
    };
    console.log(JSON.stringify(profile, null, 2));
  } catch (err) {
    console.error("ERROR GENERATING PROFILE:", err);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
