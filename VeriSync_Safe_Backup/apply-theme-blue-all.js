const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend_v2', 'src', 'pages', 'student');

const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace all tailwind blue with student
    content = content.replace(/\bblue\b/g, 'student');
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file} to remove blue`);
  }
});
