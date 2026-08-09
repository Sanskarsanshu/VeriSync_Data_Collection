require('dotenv').config({ path: __dirname + '/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({
    include: {
      subject: true,
      primaryTeacher: { include: { user: true } },
      section: true,
    }
  });
  console.log(JSON.stringify(courses, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
