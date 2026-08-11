const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');
const env = fs.readFileSync(envPath, 'utf8');
console.log('DATABASE_URL present:', env.includes('DATABASE_URL'));
console.log('JWT_SECRET present:', env.includes('JWT_SECRET'));
