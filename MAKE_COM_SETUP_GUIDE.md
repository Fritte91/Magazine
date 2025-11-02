# Make.com Setup Guide for Now Or Never Magazine Shop

This guide will help you set up the complete automation for order processing using Make.com (formerly Integromat).

## Overview

The system will:
1. **Receive order data** via webhook
2. **Upload payment slip** to Zoho Drive
3. **Save order data** to Google Sheets
4. **Send confirmation email** to customer via Zoho Mail
5. **Send notification email** to seller (info@nowornevermagazine.com)

---

## Prerequisites

- Make.com account (free tier works for getting started)
- Google account with Google Sheets access
- Zoho account with:
  - Zoho Drive access
  - Zoho Mail configured (info@nowornevermagazine.com)
- Zoho API credentials (OAuth or API key)

---

## Step-by-Step Setup

### 1. Create Your Google Sheet

Create a new Google Sheet with the following columns (in this order):

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Order ID | Order Date | Customer Name | Email | Phone | Address Line | Building | Street | Subdistrict | District | Province | Postal Code | Country | Price | Payment Status | Payment Slip Link |

**Sheet Name:** `Orders` (or your preference)

**Share with Make.com:**
- Get the Sheet ID from the URL (the long string between /d/ and /edit)
- You'll need this for Make.com setup

---

### 2. Set Up Zoho Drive Folder

1. Log in to Zoho Drive
2. Create a folder called `Magazine Orders`
3. Inside, create subfolders by month: `2024-11`, `2024-12`, etc.
4. Note the folder ID (you can get this from the URL when viewing the folder)

---

### 3. Configure Zoho Mail API

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Create a new "Self Client"
3. Generate OAuth tokens with scopes:
   - `ZohoMail.messages.CREATE`
   - `ZohoMail.accounts.READ`
4. Save your:
   - Client ID
   - Client Secret
   - Refresh Token

---

### 4. Create Make.com Scenario

#### Module 1: Webhooks - Custom Webhook

1. Add a **Webhooks → Custom Webhook** module
2. Create a new webhook
3. Copy the webhook URL
4. **Important:** Update the webhook URL in `script.js` (line 214):
   ```javascript
   const makeWebhookUrl = 'YOUR_WEBHOOK_URL_HERE';
   ```

**Expected Data Structure:**
```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "0812345678",
  "address_line": "123 Main St",
  "building": "Building Name",
  "street": "Street Name",
  "subdistrict": "Subdistrict",
  "district": "District",
  "province": "Province",
  "postal_code": "10110",
  "country": "Thailand",
  "order_type": "magazine_order",
  "product": "Now Or Never 420 Magazine",
  "price": "1420",
  "currency": "THB",
  "payment_slip": {
    "name": "filename.jpg",
    "data": "base64_encoded_file_data",
    "type": "image/jpeg",
    "size": 123456
  }
}
```

#### Module 2: Generate Order ID (Optional but recommended)

1. Add **Tools → Set Variable** module
2. Variable name: `order_id`
3. Variable value: `ORD-{{formatDate(now; "YYYYMMDD")}}-{{substring(1.uuid; 1; 6)}}`

#### Module 3: Upload to Zoho Drive

1. Add **Zoho Drive → Upload a File** module
2. Connect your Zoho account
3. Settings:
   - **Folder:** Select your "Magazine Orders" folder
   - **File name:** `{{2.order_id}}_{{1.name}}.{{1.payment_slip.type}}`
   - **File data:** `{{1.payment_slip.data}}`
4. **Router:** Add after this to split into two paths

#### Module 4a: Add Row to Google Sheets

1. Add **Google Sheets → Add a Row** module
2. Connect your Google account
3. Settings:
   - **Spreadsheet:** Select your orders spreadsheet
   - **Sheet:** `Orders`
   - **Values:** Map each column:

| Column | Value |
|--------|-------|
| Order ID | `{{2.order_id}}` or generate new one |
| Order Date | `{{formatDate(now; "YYYY-MM-DD HH:mm:ss")}}` |
| Customer Name | `{{1.name}}` |
| Email | `{{1.email}}` |
| Phone | `{{1.phone}}` |
| Address Line | `{{1.address_line}}` |
| Building | `{{1.building}}` |
| Street | `{{1.street}}` |
| Subdistrict | `{{1.subdistrict}}` |
| District | `{{1.district}}` |
| Province | `{{1.province}}` |
| Postal Code | `{{1.postal_code}}` |
| Country | `{{1.country}}` |
| Price | `{{1.price}}` |
| Payment Status | `Pending Verification` |
| Payment Slip Link | `{{3.url}}` (from Zoho Drive upload) |

#### Module 4b: Send Customer Confirmation (Zoho Mail)

1. Add **Zoho Mail → Send an Email** module
2. Connect your Zoho account (use info@nowornevermagazine.com)
3. Settings:
   - **From:** `info@nowornevermagazine.com`
   - **To:** `{{1.email}}`
   - **Subject:** `Order Confirmation - {{2.order_id}}`
   - **Body Type:** HTML
   - **Body:**

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌿 Order Confirmed!</h1>
            <p>Thank you for your order</p>
        </div>
        
        <div class="content">
            <p>Hi {{1.name}},</p>
            
            <p>We've received your order for <strong>Now Or Never 420 Magazine</strong>!</p>
            
            <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> {{2.order_id}}</p>
                <p><strong>Order Date:</strong> {{formatDate(now; "MMMM DD, YYYY")}}</p>
                <p><strong>Product:</strong> Now Or Never 420 Magazine</p>
                <p><strong>Price:</strong> ฿1,420 THB</p>
                <p><strong>Payment Status:</strong> Pending Verification</p>
                
                <h4>Shipping Address:</h4>
                <p>
                    {{1.name}}<br>
                    {{1.address_line}}<br>
                    {{1.building}}, {{1.street}}<br>
                    {{1.subdistrict}}, {{1.district}}<br>
                    {{1.province}} {{1.postal_code}}<br>
                    {{1.country}}
                </p>
            </div>
            
            <h3>What's Next?</h3>
            <ol>
                <li>We'll verify your payment slip within 24 hours</li>
                <li>Once verified, we'll process and ship your magazine</li>
                <li>You'll receive a tracking number via email</li>
                <li>Delivery typically takes 2-3 business days within Thailand</li>
            </ol>
            
            <p>If you have any questions, please don't hesitate to contact us at <a href="mailto:info@nowornevermagazine.com">info@nowornevermagazine.com</a></p>
        </div>
        
        <div class="footer">
            <p>Now Or Never Magazine<br>
            Bringing you the best cannabis culture content in Thailand</p>
            <p>📧 info@nowornevermagazine.com | 🌐 nowornever420.com</p>
        </div>
    </div>
</body>
</html>
```

#### Module 5: Send Seller Notification

1. Add **Zoho Mail → Send an Email** module (after the router)
2. Settings:
   - **From:** `info@nowornevermagazine.com`
   - **To:** `info@nowornevermagazine.com` (or your seller email)
   - **Subject:** `🔔 New Order: {{2.order_id}} - {{1.name}}`
   - **Body:**

```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>New Magazine Order Received!</h2>
    
    <h3>Order Information</h3>
    <ul>
        <li><strong>Order ID:</strong> {{2.order_id}}</li>
        <li><strong>Order Date:</strong> {{formatDate(now; "YYYY-MM-DD HH:mm:ss")}}</li>
    </ul>
    
    <h3>Customer Information</h3>
    <ul>
        <li><strong>Name:</strong> {{1.name}}</li>
        <li><strong>Email:</strong> {{1.email}}</li>
        <li><strong>Phone:</strong> {{1.phone}}</li>
    </ul>
    
    <h3>Shipping Address</h3>
    <p>
        {{1.address_line}}<br>
        {{1.building}}, {{1.street}}<br>
        {{1.subdistrict}}, {{1.district}}<br>
        {{1.province}} {{1.postal_code}}<br>
        {{1.country}}
    </p>
    
    <h3>Order Details</h3>
    <ul>
        <li><strong>Product:</strong> {{1.product}}</li>
        <li><strong>Price:</strong> ฿{{1.price}} {{1.currency}}</li>
        <li><strong>Payment Status:</strong> Pending Verification</li>
    </ul>
    
    <h3>Payment Slip</h3>
    <p><a href="{{3.url}}" target="_blank">View Payment Slip in Zoho Drive</a></p>
    
    <hr>
    
    <h3>Action Required:</h3>
    <ol>
        <li>Verify the payment slip</li>
        <li>Update the order status in Google Sheets</li>
        <li>Process and ship the magazine</li>
        <li>Send tracking information to customer</li>
    </ol>
    
    <p><a href="[YOUR_GOOGLE_SHEET_URL]" style="display: inline-block; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">View in Google Sheets</a></p>
</body>
</html>
```

#### Module 6: HTTP Response (Optional but recommended)

1. Add **Webhooks → Webhook Response** module
2. Settings:
   - **Status:** 200
   - **Body:**
```json
{
  "status": "success",
  "message": "Order received successfully",
  "order_id": "{{2.order_id}}"
}
```

---

## Testing Your Setup

### Test Data

Use this test JSON in Make.com's "Run Once" feature:

```json
{
  "name": "Test Customer",
  "email": "test@example.com",
  "phone": "0812345678",
  "address_line": "123 Test Street",
  "building": "Test Building",
  "street": "Test Road",
  "subdistrict": "Test Subdistrict",
  "district": "Test District",
  "province": "Bangkok",
  "postal_code": "10110",
  "country": "Thailand",
  "order_type": "magazine_order",
  "product": "Now Or Never 420 Magazine",
  "price": "1420",
  "currency": "THB",
  "payment_slip": {
    "name": "test_payment.jpg",
    "data": "/9j/4AAQSkZJRgABAQAAAQABAAD...",
    "type": "image/jpeg",
    "size": 12345
  }
}
```

### Testing Checklist

- [ ] Webhook receives data correctly
- [ ] Order ID is generated
- [ ] File uploads to Zoho Drive
- [ ] Row is added to Google Sheets with all data
- [ ] Customer receives confirmation email
- [ ] Seller receives notification email
- [ ] HTTP response is sent back (200 OK)

---

## Security Recommendations

1. **Enable webhook authentication** in Make.com
2. **Restrict Google Sheets access** to only Make.com
3. **Set up Zoho IP restrictions** if possible
4. **Monitor failed operations** daily
5. **Set up error notifications** in Make.com
6. **Backup your Google Sheet** regularly
7. **Implement rate limiting** in Make.com (included in Pro plans)

---

## Error Handling

### Common Issues

1. **File upload fails:**
   - Check file size limit in Zoho Drive
   - Verify base64 encoding is correct
   - Check Zoho Drive API permissions

2. **Email not sending:**
   - Verify Zoho Mail authentication
   - Check email quota limits
   - Verify sender email is configured

3. **Google Sheets error:**
   - Check column mapping
   - Verify sheet name is correct
   - Check Google API permissions

### Set Up Error Notifications

1. In Make.com, add error handlers to critical modules
2. Configure email notifications for failures
3. Set up a fallback route to save data temporarily

---

## Maintenance

### Weekly Tasks
- Review Google Sheets for any missing entries
- Check Zoho Drive for orphaned files
- Verify email deliverability

### Monthly Tasks
- Clean up old test data
- Review and optimize scenario performance
- Update email templates if needed
- Backup Google Sheets data

---

## Advanced Features (Optional)

### Auto-tracking Number Integration
- Add Thailand Post API integration
- Automatically update sheet with tracking numbers
- Send tracking email to customers

### Payment Verification Automation
- Add OCR to read payment slip amounts
- Auto-verify payments against order totals
- Flag mismatches for manual review

### Inventory Management
- Track magazine stock in separate sheet
- Decrement stock on order
- Alert when stock is low

---

## Support

If you need help with setup:
1. Check Make.com documentation: https://www.make.com/en/help
2. Zoho API docs: https://www.zoho.com/mail/help/api/
3. Google Sheets API: https://developers.google.com/sheets/api

---

## Cost Estimate

**Make.com:**
- Free: 1,000 operations/month (sufficient for ~100-200 orders)
- Core: $9/month - 10,000 operations
- Pro: $16/month - 20,000 operations + premium features

**Zoho:**
- Mail Lite: Free (or included with Zoho One)
- WorkDrive: 5GB free

**Google Sheets:**
- Free with Google account

**Total estimated cost:** $0-16/month depending on volume

---

**Created:** November 2024  
**Last Updated:** November 2024  
**Version:** 1.0


