require('dotenv').config({ path: __dirname + '/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const students = await prisma.user.findMany({
    where: {
      role: 'STUDENT',
      studentProfile: {
        name: {
          contains: 'shree',
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
    console.log('No student found with the name containing "shree".');
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
