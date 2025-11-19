const fs = require('fs');
const path = require('path');

// Configure paths
const projectRoot = path.join(__dirname, '..');
const albumDir = path.join(projectRoot, 'assets', 'album'); // put your album images here
const outFile = path.join(projectRoot, 'images.json');

const exts = ['.jpg', '.jpeg', '.png', '.webp'];

if (!fs.existsSync(albumDir)) {
  console.error('Folder not found:', albumDir);
  process.exit(1);
}

const files = fs.readdirSync(albumDir)
  .filter(f => exts.includes(path.extname(f).toLowerCase()))
  .sort();

const urls = files.map(f => `assets/album/${f}`);

fs.writeFileSync(outFile, JSON.stringify(urls, null, 2), 'utf8');
console.log(`Generated ${outFile} with ${urls.length} images.`);
