import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { email: { contains: 'sasdf' } }
  });

  for (const user of users) {
    await prisma.user.delete({ where: { id: user.id } });
    console.log(`Deleted test user: ${user.email}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
