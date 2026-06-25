const fs = require('fs');
const files = ['src/App.tsx', 'src/components/RadioPlayer.tsx'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Replace backgrounds with blue/purple
  content = content.replace(/bg-\[\#121212\]/g, 'bg-gradient-to-br from-[#1e1b4b] to-[#1e3a8a]');
  
  // Replace stone-900 and stone-800 with deep blue/purple equivalents
  content = content.replace(/bg-stone-900/g, 'bg-blue-900/40');
  content = content.replace(/bg-stone-800/g, 'bg-[#1e1b4b]');
  content = content.replace(/bg-stone-950/g, 'bg-blue-950');
  
  // Ensure text is white
  content = content.replace(/text-stone-300/g, 'text-white');
  content = content.replace(/text-stone-400/g, 'text-blue-100');
  content = content.replace(/text-stone-500/g, 'text-blue-200');
  content = content.replace(/text-stone-600/g, 'text-white');
  content = content.replace(/text-stone-700/g, 'text-white');
  content = content.replace(/text-stone-800/g, 'text-white');
  content = content.replace(/text-stone-900/g, 'text-white');
  content = content.replace(/text-neutral-300/g, 'text-white');
  
  // borders
  content = content.replace(/border-stone-200/g, 'border-blue-400/30');
  content = content.replace(/border-stone-800/g, 'border-blue-400/20');
  
  // other colors
  content = content.replace(/bg-\[\#1a1a1a\]/g, 'bg-[#2e1065]/60');
  content = content.replace(/bg-\[\#0a0a0a\]/g, 'bg-[#172554]/80');
  
  // Yellow like Ndejje school
  content = content.replace(/bg-\[\#f38b20\]/g, 'bg-[#fcd34d] text-[#1e1b4b]');
  content = content.replace(/text-\[\#f38b20\]/g, 'text-[#fcd34d]');
  content = content.replace(/border-\[\#f38b20\]/g, 'border-[#fcd34d]');
  content = content.replace(/from-\[\#f38b20\]/g, 'from-[#fcd34d]');

  // Header background
  content = content.replace(/bg-\[\#f38b20\] w-full/g, 'bg-[#1e1b4b] w-full border-b border-[#fcd34d]/20');
  
  fs.writeFileSync(file, content, 'utf-8');
}
console.log('done');
