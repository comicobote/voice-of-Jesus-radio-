const fs = require('fs');
const files = ['src/App.tsx', 'src/components/RadioPlayer.tsx'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/bg-\[\#1e1b4b\]lue-900\/40\/30/g, 'bg-[#1e3a8a]/30');
  content = content.replace(/bg-\[\#1e1b4b\]lue-900\/40\/50/g, 'bg-[#1e3a8a]/50');
  content = content.replace(/bg-\[\#1e1b4b\]lue-900\/40\/20/g, 'bg-[#1e3a8a]/20');
  content = content.replace(/bg-\[\#1e1b4b\]lue-900\/40/g, 'bg-[#1e3a8a]/40');
  content = content.replace(/bg-\[\#1e1b4b\]lack\/80/g, 'bg-black/80');
  content = content.replace(/border-blue-400\/30\/30/g, 'border-blue-400/30');
  fs.writeFileSync(file, content, 'utf-8');
}
console.log('done');
