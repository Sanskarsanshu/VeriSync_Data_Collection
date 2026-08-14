import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const teachers = await p.user.findMany({
    where: { role: 'TEACHER' },
    include: { teacherProfile: true }
  });
  
  console.log(`\nTotal TEACHER users: ${teachers.length}\n`);
  for (const u of teachers) {
    console.log(`Email: ${u.email} | EmpID: ${u.teacherProfile?.employeeId} | Name: ${u.teacherProfile?.name}`);
  }
}

main().finally(() => p.$disconnect());
