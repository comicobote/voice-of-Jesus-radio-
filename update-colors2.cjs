const fs = require('fs');
const files = ['src/App.tsx', 'src/components/RadioPlayer.tsx'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Replace reds with purples/blues
  content = content.replace(/bg-\[\#df2027\]/g, 'bg-[#fcd34d]');
  content = content.replace(/text-\[\#df2027\]/g, 'text-[#fcd34d]');
  content = content.replace(/border-\[\#df2027\]/g, 'border-[#fcd34d]');
  content = content.replace(/from-\[\#df2027\]/g, 'from-[#fcd34d]');

  content = content.replace(/bg-red-500/g, 'bg-purple-500');
  content = content.replace(/text-red-500/g, 'text-purple-500');
  content = content.replace(/border-red-500/g, 'border-purple-500');
  content = content.replace(/from-red-900/g, 'from-purple-900');
  content = content.replace(/via-red-800/g, 'via-purple-800');
  content = content.replace(/to-red-900/g, 'to-purple-900');
  
  // Also change the header bg which might have text-[#1e1b4b] to just yellow
  // wait, earlier I changed bg-[#f38b20] to bg-[#fcd34d] text-[#1e1b4b]
  // Let's make sure it's valid
  fs.writeFileSync(file, content, 'utf-8');
}
console.log('done');
