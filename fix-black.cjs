const fs = require('fs');
const files = ['src/App.tsx', 'src/components/RadioPlayer.tsx'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/bg-\[\#1e1b4b\]lack/g, 'bg-black');
  fs.writeFileSync(file, content, 'utf-8');
}
console.log('done');
