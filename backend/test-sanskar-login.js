require('dotenv').config({ path: __dirname + '/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'sanskar97716@gmail.com' },
    include: {
      studentProfile: true
    }
  });

  if (!user) {
    console.log("USER NOT FOUND");
    return;
  }
  
  console.log("User in DB:", JSON.stringify(user, null, 2));

  const name =
    user.adminProfile?.name ??
    user.teacherProfile?.name ??
    user.studentProfile?.name ??
    user.email;
    
  console.log("Resolved Name:", name);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
