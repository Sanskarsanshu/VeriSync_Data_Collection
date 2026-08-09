const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const student = await prisma.user.findFirst({
    where: { role: 'STUDENT' },
  });
  console.log('STUDENT_CREDENTIALS:', student);
  await prisma.$disconnect();
}

main().catch(console.error);
