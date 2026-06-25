<?php
$content = file_get_contents('public/firebase_api.php');

$content = str_replace(
    'if (isset($input[\'contactUsText\'])) $db[\'settings\'][\'contact_us_text\'] = $input[\'contactUsText\'];',
    'if (isset($input[\'contactUsText\'])) $db[\'settings\'][\'contact_us_text\'] = $input[\'contactUsText\'];
        if (isset($input[\'footerText\'])) $db[\'settings\'][\'footer_text\'] = $input[\'footerText\'];',
    $content
);

$content = str_replace(
    '"contactUsText" => $db[\'settings\'][\'contact_us_text\'] ?? \'\',',
    '"contactUsText" => $db[\'settings\'][\'contact_us_text\'] ?? \'\',
            "footerText" => $db[\'settings\'][\'footer_text\'] ?? \'Lira City, Northern Uganda | Call: 0769302480 / 0770795585 | WhatsApp: +256 770 795585\',',
    $content
);

file_put_contents('public/firebase_api.php', $content);
echo "Updated PHP backend";
