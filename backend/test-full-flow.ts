import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) { console.error("No admin"); return; }

  // Read JWT_SECRET from .env
  const fs = require('fs');
  const envContent = fs.readFileSync('.env', 'utf-8');
  const jwtSecretLine = envContent.split('\n').find((l: string) => l.startsWith('JWT_SECRET'));
  const jwtSecret = jwtSecretLine ? jwtSecretLine.split('=')[1].trim() : 'fallback_secret';
  
  console.log('Using JWT_SECRET:', jwtSecret.substring(0, 5) + '...');

  const token = jwt.sign(
    { sub: admin.id, email: admin.email, role: admin.role },
    jwtSecret,
    { expiresIn: '1h' }
  );

  const uniqueId = `test-${Date.now()}`;
  console.log(`\nAdding teacher with employeeId: ${uniqueId}`);

  try {
    const res = await fetch('http://localhost:3000/api/teachers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Dr. Test Professor',
        employeeId: uniqueId,
        email: `test.${uniqueId}@pwc.in`,
        dept: 'Department of Computer Applications',
        designation: 'Assistant Professor',
        subjects: [],
        status: 'ACTIVE'
      })
    });

    const text = await res.text();
    console.log(`\nStatus: ${res.status}`);
    console.log(`Response: ${text}`);

    // Now delete the test teacher
    if (res.status === 201) {
      const created = JSON.parse(text);
      console.log(`\nCleaning up - deleting ${created.id}...`);
      const delRes = await fetch(`http://localhost:3000/api/teachers/${created.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`Delete status: ${delRes.status}`);
    }
  } catch (e) {
    console.error('ERROR:', e);
  }
}

main().finally(() => prisma.$disconnect());
