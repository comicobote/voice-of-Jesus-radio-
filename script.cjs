const fs = require('fs');
const files = ['src/App.tsx', 'src/components/RadioPlayer.tsx'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/text-white/g, 'text-stone-200');
  content = content.replace(/bg-white\b/g, 'bg-stone-900');
  content = content.replace(/border-white\b/g, 'border-stone-200');
  content = content.replace(/bg-\[\#fdf2e8\]/g, 'bg-[#121212]');
  content = content.replace(/text-stone-900/g, 'text-stone-300');
  content = content.replace(/bg-[#1b4332]/g, 'bg-stone-800'); // Footer
  content = content.replace(/text-stone-200\/\d+/g, (match) => match.replace('stone-200', 'stone-400'));
  fs.writeFileSync(file, content, 'utf-8');
}
console.log('done');
