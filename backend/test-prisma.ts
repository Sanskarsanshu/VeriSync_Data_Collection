import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.auditLog.count();
    console.log("AuditLog count:", count);
  } catch (e) {
    console.error("AuditLog error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
