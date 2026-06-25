const fs = require('fs');

let content = fs.readFileSync('public/firebase_api.php', 'utf8');

content = content.replace(
    'if (isset($input[\'contactUsText\'])) $db[\'settings\'][\'contact_us_text\'] = $input[\'contactUsText\'];',
    'if (isset($input[\'contactUsText\'])) $db[\'settings\'][\'contact_us_text\'] = $input[\'contactUsText\'];\n        if (isset($input[\'footerText\'])) $db[\'settings\'][\'footer_text\'] = $input[\'footerText\'];'
);

content = content.replace(
    '"contactUsText" => $db[\'settings\'][\'contact_us_text\'] ?? \'\',',
    '"contactUsText" => $db[\'settings\'][\'contact_us_text\'] ?? \'\',\n            "footerText" => $db[\'settings\'][\'footer_text\'] ?? \'Lira City, Northern Uganda\\nCall: 0769302480 / 0770795585\\nWhatsApp: +256 770 795585\','
);

fs.writeFileSync('public/firebase_api.php', content);
console.log('Updated PHP backend');
