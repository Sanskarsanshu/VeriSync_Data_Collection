const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend_v2', 'src', 'components', 'layout', 'StudentTwoLevelSidebar.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all tailwind violet and fuchsia with student
content = content.replace(/\b(violet|fuchsia)\b/g, 'student');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Updated StudentTwoLevelSidebar.tsx');
