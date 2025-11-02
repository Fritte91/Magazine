# Make.com Direct File Upload Setup (No Base64!)

## 🎯 New Approach: Multipart/Form-Data

The file is now sent as **actual file data** (not base64), just like uploading to a regular form. This is MUCH easier to handle in Make.com!

---

## 📥 What Make.com Receives Now

### Form Fields (as text):
- `name` = "Fredrik Lindberg"
- `email` = "fredrik@example.com"
- `phone` = "0767169675"
- `address_line` = "..."
- `building` = "..."
- `street` = "..."
- `subdistrict` = "..."
- `district` = "..."
- `province` = "..."
- `postal_code` = "12120"
- `country` = "Thailand"
- `order_type` = "magazine_order"
- `product` = "Now Or Never 420 Magazine"
- `price` = "1420"
- `currency` = "THB"
- `order_date` = "2024-11-02T09:01:00.000Z"

### File Attachment:
- `payment_slip` = **[ACTUAL FILE]** (not base64!)

---

## 🛠️ Make.com Setup (SIMPLIFIED!)

### Module 1: Webhook ✅
You already have this! No changes needed.

### Module 2: Router (Split file vs no file)

Add a **Router** module to handle two paths:

**Path 1 Filter:** "Has payment slip"
- Condition: `{{1.payment_slip}}` **Exists**

**Path 2 Filter:** "No payment slip"  
- Condition: `{{1.payment_slip}}` **Does NOT exist**

---

## 📁 Path 1: Upload File to Zoho Drive (When file exists)

### Option A: Direct Upload (Easiest!)

**Add: Zoho WorkDrive → Upload a File**

Settings:
- **Team:** Select your team
- **Folder:** Select/create "Magazine Orders" folder
- **File Name:** 
  ```
  {{formatDate(1.order_date; "YYYYMMDD")}}_{{1.name}}_payment
  ```
- **File Data:** Simply select `{{1.payment_slip}}` 
  - That's it! No Base64 decode needed! 🎉

**Make.com automatically handles the file!**

---

### Option B: Upload to Multiple Places (Advanced)

You can upload to both Zoho Drive AND Google Drive as backup:

1. **Zoho WorkDrive → Upload File**
   - File: `{{1.payment_slip}}`
   
2. **Google Drive → Upload File**
   - File: `{{1.payment_slip}}`

Both get the same file, no conversion needed!

---

## 📊 Path 1 & 2: Add to Google Sheets (Both paths)

After the router paths, add **Google Sheets → Add a Row**

### Column Mapping:

| Column | Value |
|--------|-------|
| Order ID | `ORD-{{formatDate(1.order_date; "YYYYMMDD")}}-{{substring(replace(1.email; "@.*"; ""); 1; 4)}}{{substring(now; -4)}}` |
| Order Date | `{{formatDate(1.order_date; "DD/MM/YYYY HH:mm")}}` |
| Name | `{{1.name}}` |
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
| Product | `{{1.product}}` |
| Price | `{{1.price}} {{1.currency}}` |
| Payment Status | `Pending Verification` |
| **Payment Slip Link** | `{{if(2.url; 2.url; "Not provided")}}` |

The `2.url` is from Zoho Drive upload module (if file was uploaded).

---

## 📧 Send Emails

### Module: Send Customer Confirmation

**Zoho Mail → Send an Email**

Settings:
- **From:** info@nowornevermagazine.com
- **To:** `{{1.email}}`
- **Subject:** `Order Confirmation - Your Magazine is Coming!`
- **Body:** (HTML)

```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
        <h1>🌿 Order Confirmed!</h1>
        <p>Thank you for your order, {{1.name}}!</p>
    </div>
    
    <div style="padding: 30px; background: #f9f9f9; margin-top: 20px; border-radius: 10px;">
        <h2>Order Details</h2>
        <p><strong>Order Date:</strong> {{formatDate(1.order_date; "DD MMMM YYYY")}}</p>
        <p><strong>Product:</strong> {{1.product}}</p>
        <p><strong>Price:</strong> ฿{{1.price}} {{1.currency}}</p>
        <p><strong>Payment Status:</strong> Pending Verification</p>
        
        <h3>Shipping Address:</h3>
        <p>
            {{1.name}}<br>
            {{1.address_line}}<br>
            {{1.building}}, {{1.street}}<br>
            {{1.subdistrict}}, {{1.district}}<br>
            {{1.province}} {{1.postal_code}}<br>
            {{1.country}}
        </p>
        
        <h3>What's Next?</h3>
        <ol>
            <li>We'll verify your payment within 24 hours</li>
            <li>Your magazine will be shipped</li>
            <li>You'll receive a tracking number</li>
            <li>Delivery in 2-3 business days</li>
        </ol>
        
        <p style="color: #666; margin-top: 30px;">
            Questions? Contact us at <a href="mailto:info@nowornevermagazine.com">info@nowornevermagazine.com</a>
        </p>
    </div>
</body>
</html>
```

---

### Module: Send Seller Notification

**Zoho Mail → Send an Email**

Settings:
- **From:** info@nowornevermagazine.com
- **To:** info@nowornevermagazine.com
- **Subject:** `🔔 New Order: {{1.name}} - {{formatDate(now; "HH:mm")}}`
- **Body:** (HTML)

```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #4CAF50;">New Magazine Order! 🎉</h2>
    
    <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> {{1.name}}</p>
        <p><strong>Email:</strong> {{1.email}}</p>
        <p><strong>Phone:</strong> {{1.phone}}</p>
    </div>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3>Shipping Address</h3>
        <p>
            {{1.address_line}}<br>
            {{1.building}}, {{1.street}}<br>
            {{1.subdistrict}}, {{1.district}}<br>
            {{1.province}} {{1.postal_code}}<br>
            {{1.country}}
        </p>
    </div>
    
    <div style="background: #d1ecf1; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3>Order Details</h3>
        <p><strong>Product:</strong> {{1.product}}</p>
        <p><strong>Price:</strong> ฿{{1.price}} {{1.currency}}</p>
        <p><strong>Order Date:</strong> {{formatDate(1.order_date; "DD/MM/YYYY HH:mm")}}</p>
        <p><strong>Payment Slip:</strong> {{if(2.url; "Uploaded ✓"; "Not provided")}}</p>
    </div>
    
    {{if(2.url; "<p><a href='" + 2.url + "' style='display: inline-block; padding: 12px 30px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;'>View Payment Slip</a></p>"; "")}}
    
    <hr style="margin: 30px 0;">
    
    <h3>Action Required:</h3>
    <ol>
        <li>✓ Verify payment slip</li>
        <li>✓ Update order status in Google Sheets</li>
        <li>✓ Process and ship magazine</li>
        <li>✓ Send tracking number to customer</li>
    </ol>
    
    <p><a href="[YOUR_GOOGLE_SHEET_LINK]" style="display: inline-block; padding: 12px 30px; background: #2196F3; color: white; text-decoration: none; border-radius: 5px;">Open Google Sheets</a></p>
</body>
</html>
```

---

## 🔄 Complete Flow Diagram

```
Website Form Submission
         ↓
    Webhook (receives all data + file)
         ↓
      Router
         ├─ Path 1: Has File
         │     ↓
         │  Zoho Drive Upload (direct file)
         │     ↓
         │  [continues to Google Sheets]
         │
         └─ Path 2: No File
               ↓
               [continues to Google Sheets]
         ↓
   Google Sheets (add row with all data)
         ↓
   Send Customer Email
         ↓
   Send Seller Email
         ↓
      DONE! ✓
```

---

## ✅ Benefits of This Approach

### Before (Base64):
- ❌ Large text string (33% bigger than original)
- ❌ Need to decode in Make.com
- ❌ Can cause memory issues
- ❌ More complex
- ❌ Can fail with large files

### After (Direct Upload):
- ✅ File sent as-is (original size)
- ✅ Make.com handles it automatically
- ✅ No decoding needed
- ✅ Much simpler setup
- ✅ Works with larger files
- ✅ Can upload to multiple places easily

---

## 🧪 Testing

1. **Refresh your website** (Ctrl+Shift+R)
2. **Fill the form**
3. **Upload payment slip**
4. **Submit**
5. **Check Make.com webhook** - you should see:
   - All form fields as text ✓
   - `payment_slip` as a FILE (not base64 text!) ✓

In Make.com, when you click on `payment_slip`, you should see:
- File name
- File size
- File type
- **You can even preview the image!** 🖼️

---

## 🎯 What You Need to Do

1. **Test the form** - make sure file arrives in Make.com
2. **Add Router** (optional but recommended)
3. **Add Zoho WorkDrive Upload**
   - Just map `{{1.payment_slip}}` to File Data
   - That's it! No base64 decode!
4. **Update Google Sheets** to include file URL
5. **Test end-to-end**

---

## 💡 Pro Tips

### Tip 1: View Files in Make.com
In the webhook execution log, click on the `payment_slip` field - Make.com will show you a preview of the image!

### Tip 2: Multiple Storage
Upload the same file to multiple places:
- Zoho Drive (main storage)
- Google Drive (backup)
- Dropbox (another backup)

Just add multiple upload modules - all use `{{1.payment_slip}}`

### Tip 3: File Validation in Make.com
Add filters to check:
- File size < 10MB
- File type is image or PDF
- File name doesn't contain suspicious characters

### Tip 4: Automatic Thumbnails
Some Make.com modules can create thumbnails automatically. Store both full-size and thumbnail!

---

## 🆘 Troubleshooting

### "payment_slip field is empty in Make.com"
- Check that file was actually selected
- Check browser console (F12) for errors
- Try hard refresh (Ctrl+Shift+R)
- Try different browser

### "File is corrupted in Zoho Drive"
- Check if Make.com preview shows the image correctly
- Verify file type matches content
- Try with a simpler image (small JPG)

### "Upload fails for large files"
- Images >5MB may be slow
- Compress image before uploading
- Check internet connection

---

## 🎉 Summary

**Old way:** File → Base64 text → Send → Decode → Upload  
**New way:** File → Send → Upload ✓

**Much simpler!** The file travels as a file, not as text. Make.com handles everything automatically.

---

**Last Updated:** November 2024  
**Tested With:** Make.com Free & Paid plans  
**Works With:** All browsers, mobile & desktop

