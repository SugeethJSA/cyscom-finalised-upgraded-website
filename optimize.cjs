const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imgDir = path.join(__dirname, 'public', 'writeups');

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.match(/\.(png|jpg|jpeg)$/i)) {
      const parsedPath = path.parse(fullPath);
      const webpPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
      
      console.log(`Converting ${file} to WebP...`);
      try {
        await sharp(fullPath)
          .webp({ quality: 80, effort: 6 })
          .toFile(webpPath);
        
        console.log(`Successfully created ${webpPath}`);
        
        try {
          fs.unlinkSync(fullPath);
          console.log(`Deleted original file: ${fullPath}`);
        } catch (e) {
          console.error(`Could not delete ${fullPath}:`, e.message);
        }
      } catch (err) {
        console.error(`Error processing ${fullPath}:`, err.message);
      }
    }
  }
}

processDirectory(imgDir).then(() => {
  console.log('Finished converting PNGs and JPGs to WebP in writeups.');
}).catch(console.error);
