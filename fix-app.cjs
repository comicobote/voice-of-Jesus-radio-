const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(/bg-red-50/g, 'bg-blue-900/30');
content = content.replace(/border-red-100/g, 'border-blue-400');
content = content.replace(/border-red-50/g, 'border-blue-400/20');
content = content.replace(/bg-red-650/g, 'bg-blue-600');
content = content.replace(/text-red-400/g, 'text-yellow-400');
content = content.replace(/to-red-400/g, 'to-blue-500');
content = content.replace(/bg-red-50\/40/g, 'bg-blue-900/40');
content = content.replace(/border-red-200\/50/g, 'border-blue-400/50');
content = content.replace(/hover:bg-red-100/g, 'hover:bg-blue-800');
content = content.replace(/border-red-200/g, 'border-blue-400/50');
content = content.replace(/text-red-650/g, 'text-blue-300');
content = content.replace(/text-red-700/g, 'text-blue-100');

fs.writeFileSync(file, content, 'utf-8');
console.log('done');
