import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!admin) {
    console.error("No admin found");
    return;
  }

  const token = jwt.sign(
    { sub: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '1h' }
  );

  try {
    const res = await fetch('http://localhost:3000/api/teachers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Dr.rohan_test',
        employeeId: `rohan-${Date.now()}`,
        email: `rohan-${Date.now()}@pwc.in`,
        department: { id: 'd1', name: 'Computer Applications', code: 'MCA' },
        designation: 'Assistant Professor',
        subjects: [],
        status: 'ACTIVE'
      })
    });

    const text = await res.text();
    console.log(`Status: ${res.status}`);
    console.log(`Response: ${text}`);
  } catch (e) {
    console.error(e);
  }
}

main().finally(() => prisma.$disconnect());
