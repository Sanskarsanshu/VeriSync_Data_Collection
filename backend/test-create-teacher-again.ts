import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const generatedPassword = crypto.randomBytes(12).toString('base64url');
  const passwordHash = await bcrypt.hash(generatedPassword, 10);
  const department = await prisma.department.findFirst({
    where: { name: { contains: 'Computer Applications' } }
  });

  console.log("Trying to create sasdf...");

  try {
    const user = await prisma.user.create({
      data: {
        email: 'sasdf@pwc.in',
        passwordHash,
        role: 'TEACHER',
        status: 'ACTIVE',
        teacherProfile: {
          create: {
            name: 'sasdf',
            employeeId: `sasdf-id-123`,
            departmentId: department?.id || '',
            status: 'ACTIVE',
          }
        }
      },
      include: { teacherProfile: true }
    });
    console.log("Success:", user.id);
  } catch (e) {
    console.error("Prisma error:", e);
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
