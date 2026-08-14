import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const subjects = await prisma.subject.findMany();
  console.log(`Found ${subjects.length} subjects.`);

  for (const subject of subjects) {
    let sem = '1'; // Default
    
    // Extract the number part from the code (e.g. "CC101" -> "101")
    const match = subject.code.match(/\d+/);
    if (match) {
      const numStr = match[0];
      const level = parseInt(numStr[0], 10);
      
      // Usually 1xx -> Sem 1, 2xx -> Sem 2, 3xx -> Sem 3, 4xx -> Sem 4
      if (level >= 1 && level <= 6) {
        sem = level.toString();
      }
    }
    
    // Convert to Roman numeral to match frontend's expected format, or just keep as Arabic number 
    // since the frontend filter handles both perfectly. Let's stick to Arabic numbers '1', '2', etc.
    // or Roman if you prefer. The frontend form uses Roman. Let's use Roman.
    const mapToRoman: Record<string, string> = { '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V', '6': 'VI' };
    const finalSem = mapToRoman[sem] || 'I';

    await prisma.subject.update({
      where: { id: subject.id },
      data: { semester: finalSem },
    });
    
    console.log(`Updated ${subject.code} - ${subject.name} to Semester ${finalSem}`);
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
