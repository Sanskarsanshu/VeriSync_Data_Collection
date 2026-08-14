async function main() {
  try {
    const res = await fetch('http://localhost:3000/teachers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'sasdf',
        employeeId: `test-id-${Date.now()}`,
        email: `sasdf-${Date.now()}@pwc.in`,
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

main();
