const fs = require('fs');
let content = fs.readFileSync('public/firebase_api.php', 'utf8');

content = content.replace(
    'if (isset($input[\'footerText\'])) $db[\'settings\'][\'footer_text\'] = $input[\'footerText\'];',
    'if (isset($input[\'footerText\'])) $db[\'settings\'][\'footer_text\'] = $input[\'footerText\'];\n        if (isset($input[\'footerCopyrightText\'])) $db[\'settings\'][\'footer_copyright_text\'] = $input[\'footerCopyrightText\'];'
);

content = content.replace(
    '"footerText" => $db[\'settings\'][\'footer_text\'] ?? \'Lira City, Northern Uganda\\nCall: 0769302480 / 0770795585\\nWhatsApp: +256 770 795585\',',
    '"footerText" => $db[\'settings\'][\'footer_text\'] ?? \'Lira City, Northern Uganda\\nCall: 0769302480 / 0770795585\\nWhatsApp: +256 770 795585\',\n            "footerCopyrightText" => $db[\'settings\'][\'footer_copyright_text\'] ?? \'&copy; 2024 Voice Of Jesus Radio.\','
);

fs.writeFileSync('public/firebase_api.php', content);
console.log('updated php');
