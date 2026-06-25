const fs = require('fs');
const files = ['src/App.tsx', 'src/components/RadioPlayer.tsx'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/bg-stone-50/g, 'bg-[#1e3a8a]/20');
  content = content.replace(/bg-stone-100/g, 'bg-[#1e3a8a]/40');
  content = content.replace(/border-stone-100/g, 'border-blue-400/20');
  content = content.replace(/border-stone-150/g, 'border-blue-400/30');
  content = content.replace(/border-stone-300/g, 'border-blue-400/50');
  content = content.replace(/text-stone-950/g, 'text-yellow-400');
  content = content.replace(/text-stone-605/g, 'text-blue-200');
  content = content.replace(/text-stone-650/g, 'text-blue-100');
  content = content.replace(/text-stone-505/g, 'text-blue-300');
  content = content.replace(/text-stone-400/g, 'text-blue-200');
  content = content.replace(/placeholder-stone-400/g, 'placeholder-blue-300');
  
  fs.writeFileSync(file, content, 'utf-8');
}
console.log('done');
