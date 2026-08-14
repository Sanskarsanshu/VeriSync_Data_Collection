import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/prisma.service';
import { AuthService } from './src/auth/auth.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const auth = app.get(AuthService);

  const student = await prisma.student.findFirst({
    include: { user: true }
  });

  if (!student || !student.user) return console.log('No student');
  console.log('Student email:', student.user.email);

  const tokenObj = await auth.login(student.user);
  console.log('Token:', tokenObj.access_token);

  try {
    const res = await fetch('http://localhost:3000/api/students/me/dashboard', {
      headers: { Authorization: 'Bearer ' + tokenObj.access_token }
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text.substring(0, 200) + '...');
  } catch (err) {
    console.error('Fetch error:', err.message);
  }

  await app.close();
}
main();
