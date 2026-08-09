require('dotenv').config({ path: __dirname + '/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'sanskar97716@gmail.com' },
    include: { studentProfile: true }
  });

  if (!user || !user.studentProfile) return console.log("Student not found");

  const profile = await prisma.studentProfile.update({
    where: { studentId: user.studentProfile.id },
    data: {
      photoUrl: '/features/sanskar.png'
    }
  });

  console.log("Updated avatar for student!", profile.photoUrl);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
