const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  // Just ping DB to see connection string host
  await prisma.$connect();
  const url = process.env.DATABASE_URL || 'NOT SET';
  // Mask password but show host
  const masked = url.replace(/:([^@]+)@/, ':****@');
  console.log('DB URL (masked):', masked);
}
main().catch(console.error).finally(() => prisma.$disconnect());
