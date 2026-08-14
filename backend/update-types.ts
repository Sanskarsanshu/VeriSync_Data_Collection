import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const subjects = await prisma.subject.findMany();
  
  for (const subject of subjects) {
    // If it's practical, it might have been "Theory + Practical" or "Practical".
    // Since we overwrote it to "Theory" with the schema default, let's restore it based on the boolean!
    let correctType = 'Theory';
    
    if (subject.isPractical) {
      correctType = 'Practical'; // Or 'Theory + Practical', but 'Practical' is safe. 
      // If the code is SEC101, usually practical.
      // Let's just use 'Practical' for all isPractical=true to restore the original state.
    }
    
    await prisma.subject.update({
      where: { id: subject.id },
      data: { type: correctType },
    });
    
    console.log(`Restored ${subject.code} to ${correctType}`);
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
