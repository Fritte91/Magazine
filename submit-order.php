<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Author's email address
$author_email = "fredriklindberg1991@gmail.com"; // Replace with actual email

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $customer_name = $_POST['name'];
    $customer_email = $_POST['email'];
    $customer_phone = $_POST['phone'];
    $address_line = $_POST['address_line'];
    $building = $_POST['building'];
    $street = $_POST['street'];
    $subdistrict = $_POST['subdistrict'];
    $district = $_POST['district'];
    $province = $_POST['province'];
    $postal_code = $_POST['postal_code'];
    $country = $_POST['country'];

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

    // Send email
    $mail_sent = mail($author_email, $subject, $message, $headers);

    // Send response back to the client
    $response = array();
    if ($mail_sent) {
        $response['status'] = 'success';
        $response['message'] = 'Order submitted successfully! We will process your order soon.';
    } else {
        $response['status'] = 'error';
        $response['message'] = 'There was an error submitting your order. Please try again.';
    }

    // Send JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?> 