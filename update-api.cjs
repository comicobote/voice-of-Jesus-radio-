const fs = require('fs');
let content = fs.readFileSync('public/firebase_api.php', 'utf-8');

// Update save_homepage_options to include about_us and contact_us
content = content.replace(
  "if (isset($input['targetUgx'])) $db['settings']['target_ugx'] = intval($input['targetUgx']);",
  "if (isset($input['targetUgx'])) $db['settings']['target_ugx'] = intval($input['targetUgx']);\n        if (isset($input['aboutUsText'])) $db['settings']['about_us_text'] = $input['aboutUsText'];\n        if (isset($input['contactUsText'])) $db['settings']['contact_us_text'] = $input['contactUsText'];"
);

// Update get_homepage_options to return about_us and contact_us
content = content.replace(
  '"target_ugx" => intval($db[\'settings\'][\'target_ugx\'] ?? 500000),',
  '"target_ugx" => intval($db[\'settings\'][\'target_ugx\'] ?? 500000),\n            "aboutUsText" => $db[\'settings\'][\'about_us_text\'] ?? \'\',\n            "contactUsText" => $db[\'settings\'][\'contact_us_text\'] ?? \'\','
);

// Add edit_blog and delete_blog cases before default:
const editDeleteBlog = `
    case 'edit_blog':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($input)) break;
        $db = read_local_db();
        foreach ($db['blogs'] as &$b) {
            if ($b['id'] === $input['id']) {
                if (isset($input['title'])) $b['title'] = htmlspecialchars($input['title']);
                if (isset($input['category'])) $b['category'] = htmlspecialchars($input['category']);
                if (isset($input['author'])) $b['author'] = htmlspecialchars($input['author']);
                if (isset($input['content'])) $b['content'] = htmlspecialchars($input['content']);
                if (isset($input['imageUrl'])) $b['imageUrl'] = htmlspecialchars($input['imageUrl']);
            }
        }
        write_local_db($db);
        echo json_encode(["status" => "success"]);
        break;

    case 'delete_blog':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($input)) break;
        $db = read_local_db();
        $db['blogs'] = array_filter($db['blogs'], function($b) use ($input) {
            return $b['id'] !== $input['id'];
        });
        $db['blogs'] = array_values($db['blogs']);
        write_local_db($db);
        echo json_encode(["status" => "success"]);
        break;

    default:`;

content = content.replace("default:", editDeleteBlog);

fs.writeFileSync('public/firebase_api.php', content, 'utf-8');
console.log('done updating php');
