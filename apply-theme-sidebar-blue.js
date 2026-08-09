const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend_v2', 'src', 'components', 'layout', 'StudentTwoLevelSidebar.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all tailwind blue with student
content = content.replace(/\bblue\b/g, 'student');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Updated StudentTwoLevelSidebar.tsx to remove blue');
