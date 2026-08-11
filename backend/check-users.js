const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
      status: true,
      adminProfile: { select: { name: true } },
      teacherProfile: { select: { name: true, employeeId: true } },
      studentProfile: { select: { name: true, rollNumber: true } }
    }
  });
  
  console.log('\n=== ALL USERS IN DATABASE ===\n');
  for (const u of users) {
    const name = u.adminProfile?.name || u.teacherProfile?.name || u.studentProfile?.name || 'N/A';
    const extra = u.teacherProfile ? `EmpID: ${u.teacherProfile.employeeId}` : 
                  u.studentProfile ? `Roll: ${u.studentProfile.rollNumber}` : 'Admin';
    console.log(`[${u.role}] ${name} | ${u.email} | Status: ${u.status} | ${extra}`);
  }
  console.log('\n=== TOTAL:', users.length, 'users ===\n');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
