const fs = require('fs');
const files = ['src/App.tsx', 'src/components/RadioPlayer.tsx'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/text-stone-200/g, 'text-white');
  content = content.replace(/bg-\[\#fcd34d\] text-\[\#1e1b4b\] w-full/g, 'bg-[#1e1b4b] w-full');
  content = content.replace(/bg-[#1b4332]/g, 'bg-[#1e1b4b]');
  content = content.replace(/text-\[\#1e1b4b\]/g, 'text-blue-900');
  content = content.replace(/bg-stone-800/g, 'bg-blue-900');
  fs.writeFileSync(file, content, 'utf-8');
}
console.log('done');
