const fs = require('fs');
const file = 'src/components/MoMoSupport.tsx';
let content = fs.readFileSync(file, 'utf-8');

// Container
content = content.replace(
  'className="bg-sky-500 rounded-xl p-6 md:p-8 relative overflow-hidden transition-all duration-350 shadow-lg text-white"',
  'className="bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] border border-blue-400/20 rounded-xl p-6 md:p-8 relative overflow-hidden transition-all duration-350 shadow-2xl text-white"'
);

// Any sky colors
content = content.replace(/bg-sky-600/g, 'bg-white/10');
content = content.replace(/border-sky-400/g, 'border-white/20');
content = content.replace(/text-sky-900/g, 'text-blue-900');

fs.writeFileSync(file, content, 'utf-8');
console.log('done');
