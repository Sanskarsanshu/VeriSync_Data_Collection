const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '.env');
let env = fs.readFileSync(envPath, 'utf8');

// Only add JWT_SECRET if it doesn't already exist
if (!env.includes('JWT_SECRET')) {
  const secret = require('crypto').randomBytes(48).toString('base64');
  env = env.trimEnd() + '\nJWT_SECRET="' + secret + '"\n';
  fs.writeFileSync(envPath, env, 'utf8');
  console.log('JWT_SECRET added to .env successfully.');
} else {
  console.log('JWT_SECRET already exists in .env — skipping.');
}

// Verify both keys are present (safe, no values shown)
const final = fs.readFileSync(envPath, 'utf8');
console.log('DATABASE_URL present:', final.includes('DATABASE_URL'));
console.log('JWT_SECRET present:', final.includes('JWT_SECRET'));
