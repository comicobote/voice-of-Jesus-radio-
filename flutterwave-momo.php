<?php
/**
 * Voice of Jesus Radio - Flutterwave Mobile Money Uganda Integration
 * Host this file on your Asura Web Hosting in the public_html root folder.
 * Endpoint: https://yourdomain.com/flutterwave-momo.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow your frontend to talk to this backend
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method. Use POST."]);
    exit;
}

// 1. Get the payload from the frontend
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

$amount = isset($input['amount']) ? $input['amount'] : null;
$email = isset($input['email']) ? $input['email'] : null;
$phone_number = isset($input['phone_number']) ? $input['phone_number'] : null;
$fullname = isset($input['fullname']) ? $input['fullname'] : null;
$network = isset($input['network']) ? $input['network'] : 'MTN'; // MTN or AIRTEL
$redirect_url = isset($input['redirect_url']) ? $input['redirect_url'] : 'https://voiceofjesusradio.com/';

if (!$amount || !$email || !$phone_number || !$fullname) {
    echo json_encode(["status" => "error", "message" => "Missing required fields (amount, email, phone_number, fullname)"]);
    exit;
}

// 2. Format phone number to Uganda format (256...)
$cleanPhone = preg_replace('/[^0-9]/', '', $phone_number);
if (strpos($cleanPhone, '0') === 0) {
    $cleanPhone = '256' . substr($cleanPhone, 1);
} elseif (strpos($cleanPhone, '7') === 0 || strpos($cleanPhone, '3') === 0) {
    $cleanPhone = '256' . $cleanPhone;
}

// Generate a unique transaction reference
$tx_ref = 'VOJ-TX-' . time() . '-' . rand(100, 999);

// 3. Your Flutterwave Secret Key
$secret_key = 'FLWSECK-9fc00d8cbd16eb53168dbaa92624ee5c-19c53a05eb1vt-X';

// 4. Prepare the payload for Flutterwave Mobile Money Uganda
$payload = [
    "amount" => $amount,
    "currency" => "UGX",
    "email" => $email,
    "phone_number" => $cleanPhone,
    "fullname" => $fullname,
    "tx_ref" => $tx_ref,
    "network" => strtoupper($network),
    "redirect_url" => $redirect_url
];

// 5. Initialize cURL to send POST to Flutterwave Endpoint
$ch = curl_init('https://api.flutterwave.com/v3/charges?type=mobile_money_uganda');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $secret_key,
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
    echo json_encode(["status" => "error", "message" => "cURL Error: " . $err]);
    exit;
}

$flutterwave_response = json_decode($response, true);

// 6. Output the exact Flutterwave response back to the frontend
echo json_encode([
    "status" => "success",
    "tx_ref" => $tx_ref,
    "flutterwave" => $flutterwave_response
]);
exit;
