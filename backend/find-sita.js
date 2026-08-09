require('dotenv').config({ path: __dirname + '/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const students = await prisma.user.findMany({
    where: {
      role: 'STUDENT',
      studentProfile: {
        name: {
          contains: 'sita',
          mode: 'insensitive'
        }
      }
    },
    include: {
      studentProfile: true
    }
  });

  if (students.length > 0) {
    console.log('Found students:');
    students.forEach(s => {
      console.log(`Name: ${s.studentProfile.name}, Email: ${s.email}`);
    });
  } else {
    console.log('No student found with the name containing "sita".');
    
    // Fallback: search all students just to list them
    const all = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: { studentProfile: true },
      take: 5
    });
    console.log('\nHere are some students that DO exist:');
    all.forEach(s => {
      console.log(`Name: ${s.studentProfile?.name}, Email: ${s.email}`);
    });
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
