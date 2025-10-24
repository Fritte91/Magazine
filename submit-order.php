<?php
// PRODUCTION SECURITY: Disable error display, log errors instead
error_reporting(0);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error_log.txt');

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');

// Rate limiting (basic implementation - consider using Redis in production)
session_start();
$max_submissions = 3; // Max submissions per hour
$time_window = 3600; // 1 hour in seconds

if (!isset($_SESSION['submissions'])) {
    $_SESSION['submissions'] = [];
}

// Clean old submissions
$_SESSION['submissions'] = array_filter($_SESSION['submissions'], function($timestamp) use ($time_window) {
    return (time() - $timestamp) < $time_window;
});

if (count($_SESSION['submissions']) >= $max_submissions) {
    header('HTTP/1.1 429 Too Many Requests');
    die(json_encode(['status' => 'error', 'message' => 'Too many submissions. Please try again later.']));
}

// CSRF Protection
if (!isset($_POST['csrf_token']) || !isset($_SESSION['csrf_token']) || 
    !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    header('HTTP/1.1 403 Forbidden');
    die(json_encode(['status' => 'error', 'message' => 'Invalid security token']));
}

// Author's email address (store in environment variable in production)
$author_email = getenv('ORDER_EMAIL') ?: "orders@nowornever420.com";

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Input validation and sanitization
    function sanitize_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
        return $data;
    }
    
    function validate_email($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }
    
    function validate_phone($phone) {
        // Thai phone format: 10 digits starting with 0
        return preg_match('/^0\d{9}$/', $phone);
    }
    
    // Get and sanitize form data
    $customer_name = sanitize_input($_POST['name'] ?? '');
    $customer_email = sanitize_input($_POST['email'] ?? '');
    $customer_phone = sanitize_input($_POST['phone'] ?? '');
    $address_line = sanitize_input($_POST['address_line'] ?? '');
    $building = sanitize_input($_POST['building'] ?? '');
    $street = sanitize_input($_POST['street'] ?? '');
    $subdistrict = sanitize_input($_POST['subdistrict'] ?? '');
    $district = sanitize_input($_POST['district'] ?? '');
    $province = sanitize_input($_POST['province'] ?? '');
    $postal_code = sanitize_input($_POST['postal_code'] ?? '');
    $country = sanitize_input($_POST['country'] ?? '');
    
    // Validate required fields
    $errors = [];
    
    if (empty($customer_name) || strlen($customer_name) < 2) {
        $errors[] = 'Invalid name';
    }
    
    if (!validate_email($customer_email)) {
        $errors[] = 'Invalid email address';
    }
    
    if (!validate_phone($customer_phone)) {
        $errors[] = 'Invalid phone number';
    }
    
    if (empty($address_line) || empty($district) || empty($province)) {
        $errors[] = 'Missing required address fields';
    }
    
    if (!empty($errors)) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => implode(', ', $errors)]);
        exit;
    }

    // Handle file upload
    $payment_slip = '';
    if (isset($_FILES['paymentSlip']) && $_FILES['paymentSlip']['error'] == 0) {
        $upload_dir = 'uploads/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $file_name = time() . '_' . $_FILES['paymentSlip']['name'];
        $upload_path = $upload_dir . $file_name;

        if (move_uploaded_file($_FILES['paymentSlip']['tmp_name'], $upload_path)) {
            $payment_slip = $upload_path;
        }
    }

    // Prepare email content
    $subject = "New Magazine Order from $customer_name";
    
    $message = "New magazine order received:\n\n";
    $message .= "Customer Details:\n";
    $message .= "Name: $customer_name\n";
    $message .= "Email: $customer_email\n";
    $message .= "Phone: $customer_phone\n\n";
    
    $message .= "Shipping Address:\n";
    $message .= "Address: $address_line\n";
    $message .= "Building: $building\n";
    $message .= "Street: $street\n";
    $message .= "Subdistrict: $subdistrict\n";
    $message .= "District: $district\n";
    $message .= "Province: $province\n";
    $message .= "Postal Code: $postal_code\n";
    $message .= "Country: $country\n\n";
    
    $message .= "Order Details:\n";
    $message .= "Product: Now Or Never Magazine\n";
    $message .= "Price: ฿1420\n";
    $message .= "Payment Status: Payment Slip Attached\n";

    // Email headers
    $headers = "From: $customer_email\r\n";
    $headers .= "Reply-To: $customer_email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // If there's a payment slip, attach it
    if ($payment_slip) {
        $file = file_get_contents($payment_slip);
        $content = chunk_split(base64_encode($file));
        $uid = md5(uniqid(time()));

        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"$uid\"\r\n\r\n";
        
        // Message part
        $email_message = "--$uid\r\n";
        $email_message .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $email_message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $email_message .= $message . "\r\n\r\n";
        
        // Attachment part
        $email_message .= "--$uid\r\n";
        $email_message .= "Content-Type: application/octet-stream; name=\"" . basename($payment_slip) . "\"\r\n";
        $email_message .= "Content-Transfer-Encoding: base64\r\n";
        $email_message .= "Content-Disposition: attachment; filename=\"" . basename($payment_slip) . "\"\r\n\r\n";
        $email_message .= $content . "\r\n\r\n";
        $email_message .= "--$uid--";

        $message = $email_message;
    }

    // Send email (consider using PHPMailer for better security in production)
    $mail_sent = @mail($author_email, $subject, $message, $headers);

    // Log submission
    $_SESSION['submissions'][] = time();
    
    // Send response back to the client
    $response = array();
    if ($mail_sent) {
        $response['status'] = 'success';
        $response['message'] = 'Order submitted successfully! We will process your order soon.';
        
        // Log successful order (consider using a database in production)
        error_log("Order received from: $customer_email");
    } else {
        $response['status'] = 'error';
        $response['message'] = 'There was an error submitting your order. Please try again.';
        
        // Log error
        error_log("Failed to send order email from: $customer_email");
    }

    // Send JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
} else {
    // Generate CSRF token for the form
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
}
?> 