require('dotenv').config({ path: __dirname + '/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'sanskar97716@gmail.com' },
    include: {
      studentProfile: { 
        select: { 
          name: true, 
          rollNumber: true, 
          id: true,
          profile: { select: { photoUrl: true } }
        } 
      },
    },
  });

  console.log("User fetched by getMe simulation:");
  console.log("Avatar:", user?.studentProfile?.profile?.photoUrl);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
