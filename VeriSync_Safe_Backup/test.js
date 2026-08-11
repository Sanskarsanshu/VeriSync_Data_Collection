fetch('http://localhost:3001/attendance/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ courseId: 'test', verificationMethod: 'FACE', windowMinutes: 10 })
}).then(async r => {
  console.log('Status:', r.status);
  console.log('Body:', await r.text());
}).catch(e => console.error(e));
