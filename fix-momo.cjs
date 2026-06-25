const fs = require('fs');
const file = 'src/components/MoMoSupport.tsx';
let content = fs.readFileSync(file, 'utf-8');

// Container
content = content.replace(
  'bg-transparent border border-stone-300 hover:border-[#492265]/40 rounded-xl p-6 md:p-8 relative overflow-hidden transition-all duration-350 shadow-sm',
  'bg-sky-500 rounded-xl p-6 md:p-8 relative overflow-hidden transition-all duration-350 shadow-lg text-white'
);

// Inner boxes/borders
content = content.replace(/border-stone-300/g, 'border-white/30');
content = content.replace(/bg-transparent border border-white\/30 rounded-2xl/g, 'bg-white/10 border border-white/20 rounded-2xl');

// Text colors
content = content.replace(/text-stone-900/g, 'text-white');
content = content.replace(/text-stone-800/g, 'text-white');
content = content.replace(/text-stone-700/g, 'text-blue-50');
content = content.replace(/text-stone-600/g, 'text-blue-50');
content = content.replace(/text-stone-500/g, 'text-blue-100');
content = content.replace(/text-stone-400/g, 'text-blue-200');
content = content.replace(/placeholder-stone-400/g, 'placeholder-blue-200');

// Inputs
content = content.replace(/w-full bg-transparent/g, 'w-full bg-white/20 text-white placeholder-blue-200');

// Button / highlights
content = content.replace(/text-\[\#df2027\]/g, 'text-yellow-300');
content = content.replace(/bg-\[\#df2027\]/g, 'bg-yellow-400 text-sky-900');
content = content.replace(/border-\[\#df2027\]/g, 'border-yellow-400');
content = content.replace(/ring-\[\#df2027\]/g, 'ring-yellow-400');

// specifically for "Support Voice of Jesus Radio"
content = content.replace(/<h3 className="font-sans text-lg md:text-xl font-extrabold text-white tracking-tight uppercase">Support Voice of Jesus Radio<\/h3>/, '<h3 className="font-sans text-lg md:text-xl font-extrabold text-white tracking-tight uppercase">Support Voice of Jesus Radio</h3>');

// Icons area
content = content.replace(/bg-\[\#492265\]\/10/g, 'bg-white/20');
content = content.replace(/border-\[\#492265\]\/20/g, 'border-white/30');

// Network carrier text in the box
content = content.replace(/text-stone-950/g, 'text-sky-900');

// "Select Support Amount"
content = content.replace(/bg-transparent hover:bg-stone-100\/50 text-white border-white\/30/g, 'bg-white/10 hover:bg-white/20 text-white border-white/30');
content = content.replace(/bg-transparent hover:bg-stone-100\/50/g, 'bg-white/10 hover:bg-white/20');

// Success state bg
content = content.replace(/bg-stone-50/g, 'bg-sky-600');
content = content.replace(/border-stone-200/g, 'border-sky-400');

fs.writeFileSync(file, content, 'utf-8');
console.log('done momo');
