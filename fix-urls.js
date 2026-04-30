const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'client', 'src');
const extensions = ['.js', '.jsx'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (extensions.includes(path.extname(fullPath))) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk(srcDir);
let changed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Replace hardcoded localhost URLs with environment variable
  content = content.replace(
    /http:\/\/localhost:9000/g,
    '`${process.env.REACT_APP_API_URL || "http://localhost:9000"}`'
  );
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✓ ${file}`);
    changed++;
  }
});

console.log(`\n✅ Replaced in ${changed} files. Now run:\n   git add .\n   git commit -m "Use REACT_APP_API_URL for backend"\n   git push`);