import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: { studentProfile: true }
  });
  
  const badUsers = users.filter(u => !u.studentProfile);
  console.log('Total students:', users.length);
  console.log('Students without profile:', badUsers.length);
  
  if (badUsers.length > 0) {
    console.log('First bad user:', badUsers[0].email);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
