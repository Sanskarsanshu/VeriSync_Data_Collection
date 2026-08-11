require('dotenv').config({ path: __dirname + '/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const http = require('http');

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'sanskar97716@gmail.com' }
  });

  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fallback-secret-for-dev',
    { expiresIn: '7d' }
  );

  console.log("Testing with token");

  const dashReq = http.request({
    hostname: 'localhost',
    port: 3001,
    path: '/students/me/dashboard',
    method: 'GET',
    headers: {
      'Cookie': 'verisync_session=' + token
    }
  }, (dashRes) => {
    let data = '';
    dashRes.on('data', chunk => data += chunk);
    dashRes.on('end', () => {
      console.log('Dashboard Status:', dashRes.statusCode);
      if (dashRes.statusCode === 200) {
        console.log('Dashboard Data Success!');
      } else {
        console.error('Dashboard Failed:', data);
      }
    });
  });
  
  dashReq.end();
}

main().finally(() => prisma.$disconnect());
