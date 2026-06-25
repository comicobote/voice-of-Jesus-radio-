<?php
/**
 * Voice Of Jesus Radio - Flat File PHP Backend API
 * Connects React Frontend to a local JSON file (acting as a database)
 * Handles Admin Login, Posts, Options, and Flutterwave MoMo Payments.
 */

// Define the name of your flat-file database
define('DATA_BACKUP_FILE', __DIR__ . '/radio_fallback_store.json');

// Configure CORS for Asura Web Hosting
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle standard CORS preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$action = isset($_GET['action']) ? $_GET['action'] : 'ping';
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

// Utility: Read local flat file database
function read_local_db() {
    if (!file_exists(DATA_BACKUP_FILE)) {
        // Initialize basic defaults
        $defaults = [
            'testimonies' => [],
            'blogs' => [],
            'settings' => [
                'announcementText' => '📺 Sowing support today directly completes our radio streaming server upgrade.',
                'target_ugx' => 500000,
                'total_received_ugx' => 0,
                'public_key' => '',
                'secret_key' => ''
            ],
            'donations_log' => []
        ];
        file_put_contents(DATA_BACKUP_FILE, json_encode($defaults, JSON_PRETTY_PRINT));
        return $defaults;
    }
    return json_decode(file_get_contents(DATA_BACKUP_FILE), true);
}

// Utility: Write to local flat file database
function write_local_db($db) {
    file_put_contents(DATA_BACKUP_FILE, json_encode($db, JSON_PRETTY_PRINT));
}

// ROUTER CONTROLLERS
switch ($action) {
    case 'ping':
        echo json_encode([
            "status" => "ok",
            "message" => "Connection verified! PHP API is successfully listening.",
            "timestamp" => date('Y-m-d H:i:s'),
            "server" => $_SERVER['SERVER_SOFTWARE']
        ]);
        break;

    case 'admin_login':
    case 'admin/login':
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        // Administrator credentials
        if ($email === "bonnyobote6@gmail.com" && $password === "Ex@#bonny43896") {
            echo json_encode(["status" => "success", "role" => "admin", "email" => $email]);
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "error" => "Access Denied. Unauthorized administrator details."]);
        }
        break;

    case 'get_settings':
        $db = read_local_db();
        $publicKey = $db['settings']['public_key'] ?? '';
        $secretKey = $db['settings']['secret_key'] ?? '';
        echo json_encode(["public_key" => $publicKey, "secret_key" => $secretKey]);
        break;

    case 'save_settings':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($input)) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid parameters"]);
            break;
        }
        $db = read_local_db();
        if (isset($input['public_key'])) {
            $db['settings']['public_key'] = trim($input['public_key']);
        }
        if (isset($input['secret_key']) && trim($input['secret_key']) !== '') {
            $db['settings']['secret_key'] = trim($input['secret_key']);
        }
        write_local_db($db);
        echo json_encode(["status" => "success", "message" => "Flutterwave credentials stored."]);
        break;

    case 'get_testimonies':
        $db = read_local_db();
        echo json_encode(['testimonies' => $db['testimonies']]);
        break;

    case 'add_testimony':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($input)) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid POST payload."]);
            break;
        }
        
        $db = read_local_db();
        $newTestimony = [
            'id' => uniqid('testimony_'),
            'name' => htmlspecialchars($input['name'] ?? 'John Doe'),
            'location' => htmlspecialchars($input['location'] ?? 'Lira City'),
            'content' => htmlspecialchars($input['content'] ?? ''),
            'hallelujahs' => 1,
            'timestamp' => 'Just now'
        ];
        
        array_unshift($db['testimonies'], $newTestimony);
        write_local_db($db);
        echo json_encode(["status" => "success", "testimony" => $newTestimony]);
        break;

    case 'hallelujah_testimony':
        $test_id = isset($_GET['id']) ? $_GET['id'] : '';
        $db = read_local_db();
        $updated = false;
        foreach ($db['testimonies'] as &$t) {
            if ($t['id'] == $test_id) {
                $t['hallelujahs'] = ($t['hallelujahs'] ?? 0) + 1;
                $updated = true;
                break;
            }
        }
        if ($updated) {
            write_local_db($db);
        }
        echo json_encode(["success" => true, "testimonies" => $db['testimonies']]);
        break;

    case 'get_blogs':
        $db = read_local_db();
        echo json_encode($db['blogs']);
        break;

    case 'add_blog':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($input)) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid payload"]);
            break;
        }
        $db = read_local_db();
        $newBlog = [
            'id' => uniqid('blog_'),
            'title' => htmlspecialchars($input['title'] ?? 'Untitled Sermon'),
            'category' => htmlspecialchars($input['category'] ?? 'SERMONS'),
            'author' => htmlspecialchars($input['author'] ?? 'Pastor Bonny Obote'),
            'content' => htmlspecialchars($input['content'] ?? ''),
            'imageUrl' => htmlspecialchars($input['imageUrl'] ?? 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3'),
            'date' => date('F j, Y')
        ];
        array_unshift($db['blogs'], $newBlog);
        write_local_db($db);
        echo json_encode(["status" => "success", "blog" => $newBlog]);
        break;

    case 'get_campaign':
    case 'get_homepage_options':
        $db = read_local_db();
        $donations = isset($db['donations_log']) ? array_values($db['donations_log']) : [];
        $donations = array_reverse($donations); // Latest first
        echo json_encode([
            "announcementText" => $db['settings']['announcementText'] ?? '',
            "target_ugx" => intval($db['settings']['target_ugx'] ?? 500000),
            "aboutUsText" => $db['settings']['about_us_text'] ?? '',
            "contactUsText" => $db['settings']['contact_us_text'] ?? '',
            "footerText" => $db['settings']['footer_text'] ?? 'Lira City, Northern Uganda\nCall: 0769302480 / 0770795585\nWhatsApp: +256 770 795585',
            "footerCopyrightText" => $db['settings']['footer_copyright_text'] ?? '&copy; 2024 Voice Of Jesus Radio.',
            "total_received_ugx" => intval($db['settings']['total_received_ugx'] ?? 0),
            "donations" => array_slice($donations, 0, 10)
        ]);
        break;

    case 'save_homepage_options':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($input)) {
            http_response_code(400);
            break;
        }
        $db = read_local_db();
        if (isset($input['announcementText'])) $db['settings']['announcementText'] = htmlspecialchars($input['announcementText']);
        if (isset($input['targetUgx'])) $db['settings']['target_ugx'] = intval($input['targetUgx']);
        if (isset($input['aboutUsText'])) $db['settings']['about_us_text'] = $input['aboutUsText'];
        if (isset($input['contactUsText'])) $db['settings']['contact_us_text'] = $input['contactUsText'];
        if (isset($input['footerText'])) $db['settings']['footer_text'] = $input['footerText'];
        if (isset($input['footerCopyrightText'])) $db['settings']['footer_copyright_text'] = $input['footerCopyrightText'];
        if (isset($input['totalReceivedUgx'])) $db['settings']['total_received_ugx'] = intval($input['totalReceivedUgx']);
        write_local_db($db);
        echo json_encode(["status" => "success", "settings" => $db['settings']]);
        break;

    case 'get_listeners':
        echo json_encode(["count" => rand(310, 345)]);
        break;

    case 'add_donation':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($input)) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid query representation"]);
            break;
        }
        $db = read_local_db();
        $amount = floatval($input['amount'] ?? 1000);
        $name = htmlspecialchars($input['name'] ?? 'Contributor of Faith');
        $phone = $input['phone'] ?? $input['phone_number'] ?? '';
        $email = $input['email'] ?? ($phone . '@voiceofjesus.fm');
        $note = htmlspecialchars($input['note'] ?? 'Support Broadcast Radio');
        $tx_ref = $input['tx_ref'] ?? ('voj-sp-' . time() . '-' . rand(100, 999));
        $network = strtoupper($input['network'] ?? $input['provider'] ?? 'MTN');

        // Formulate 256 phone number for Flutterwave Uganda
        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
        if (strpos($cleanPhone, '0') === 0) {
            $cleanPhone = '256' . substr($cleanPhone, 1);
        } elseif (strpos($cleanPhone, '7') === 0 || strpos($cleanPhone, '3') === 0) {
            $cleanPhone = '256' . $cleanPhone;
        }

        $secretKey = $db['settings']['secret_key'] ?? '';
        if (!$secretKey) {
            // Hardcoded live Premium Flutterwave Secret Key (from your previous logic)
            $secretKey = 'FLWSECK-9fc00d8cbd16eb53168dbaa92624ee5c-19c53a05eb1vt-X';
        }

        // Log pending donation locally
        if (!isset($db['donations_log'])) {
            $db['donations_log'] = [];
        }
        $db['donations_log'][$tx_ref] = [
            'name' => $name,
            'amount' => $amount,
            'phone' => $cleanPhone,
            'email' => $email,
            'note' => $note,
            'status' => 'pending',
            'time' => date('Y-m-d H:i:s') // 'time' or 'timestamp' expected by UI
        ];
        write_local_db($db);

        // Call Flutterwave Direct Charge API from PHP using cURL
        $postData = [
            'amount' => $amount,
            'currency' => 'UGX',
            'email' => $email,
            'phone_number' => $cleanPhone,
            'fullname' => $name,
            'tx_ref' => $tx_ref,
            'network' => $network === 'MTN' ? 'MTN' : 'AIRTEL',
            'redirect_url' => 'https://' . ($_SERVER['HTTP_HOST'] ?? 'good.ugbeatz.com') . '/',
            'type' => 'mobile_money_uganda'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://api.flutterwave.com/v3/charges?type=mobile_money_uganda');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . trim($secretKey),
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);
        $response = curl_exec($ch);
        $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $resData = json_decode($response, true);
        
        if ($status_code === 200 && isset($resData['status']) && ($resData['status'] === 'success' || $resData['status'] === 'successful')) {
            echo json_encode([
                "status" => "success",
                "tx_ref" => $tx_ref,
                "message" => "Secure push authorization dispatched to handset successfully.",
                "data" => $resData['data']
            ]);
        } else {
            // Check if there was an error in charges, return it clearly to allow client routing
            echo json_encode([
                "status" => "error",
                "tx_ref" => $tx_ref,
                "message" => $resData['message'] ?? 'Direct carrier handshake initial contact failed. Ensure mobile money is active.'
            ]);
        }
        break;

    case 'verify_donation':
        $tx_ref = $_GET['tx_ref'] ?? '';
        if (!$tx_ref) {
            http_response_code(400);
            echo json_encode(["status" => "error", "error" => "tx_ref parameter is required"]);
            break;
        }

        $db = read_local_db();
        $secretKey = $db['settings']['secret_key'] ?? '';
        if (!$secretKey) {
            $secretKey = 'FLWSECK-9fc00d8cbd16eb53168dbaa92624ee5c-19c53a05eb1vt-X';
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://api.flutterwave.com/v3/transactions/verify-by-reference?tx_ref=' . urlencode($tx_ref));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . trim($secretKey),
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);
        $response = curl_exec($ch);
        $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $resData = json_decode($response, true);

        if ($status_code === 200 && isset($resData['status']) && $resData['status'] === 'success') {
            if ($resData['data']['status'] === 'successful') {
                if (isset($db['donations_log'][$tx_ref])) {
                    if ($db['donations_log'][$tx_ref]['status'] !== 'successful') {
                        $db['settings']['total_received_ugx'] += $resData['data']['amount'];
                        $db['donations_log'][$tx_ref]['status'] = 'successful';
                        write_local_db($db);
                    }
                }
                echo json_encode(["status" => "success", "message" => "Payment verified successfully"]);
            } else {
                echo json_encode(["status" => "pending", "message" => "Payment is still pending"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Verification failed"]);
        }
        break;

    
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

    default:
        http_response_code(404);
        echo json_encode(["error" => "Endpoint/action not found."]);
        break;
}
