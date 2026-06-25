const fs = require('fs');
const file = 'src/components/RadioPlayer.tsx';
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(/bg-red-50/g, 'bg-blue-900/30');
content = content.replace(/border-red-200/g, 'border-blue-400');
content = content.replace(/text-red-700/g, 'text-yellow-400');
content = content.replace(/hover:border-red-400\/30/g, 'hover:border-yellow-400/30');
content = content.replace(/to-red-400/g, 'to-yellow-500');
content = content.replace(/from-rose-500/g, 'from-blue-500');
content = content.replace(/via-red-350/g, 'via-blue-400');
content = content.replace(/to-rose-400/g, 'to-blue-300');
content = content.replace(/via-red-650/g, 'via-purple-600');

fs.writeFileSync(file, content, 'utf-8');
console.log('done');
