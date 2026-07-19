const fs = require('fs');
const path = require('path');

const writeupsDir = path.join(__dirname, 'public', 'writeups');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(/\.(png|jpg|jpeg)(['"])/gi, '.webp$2');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated references in ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (file.match(/\.(js|jsx|json)$/i)) {
      processFile(fullPath);
    }
  }
}

processDirectory(writeupsDir);
console.log("Finished replacing occurrences in public/writeups");
