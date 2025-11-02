# Make.com File Upload Setup Guide

## 📸 How Payment Slips Are Now Sent

The updated code sends the payment slip as **base64 encoded data** inside a JSON object:

```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "0812345678",
  // ... other form fields ...
  "payment_slip": {
    "name": "IMG_1234.jpg",
    "type": "image/jpeg",
    "size": 123456,
    "data": "base64_encoded_string_here..."
  }
}
```

If no file is uploaded, `payment_slip` will be `null`.

---

## 🛠️ Make.com Setup for File Upload

### Module 1: Webhook (Already Done)
Your webhook will now receive JSON with the file data.

### Module 2: Router (Recommended)
Add a **Router** after the webhook to handle two scenarios:
- **Path 1:** File uploaded (payment_slip is not null)
- **Path 2:** No file uploaded (payment_slip is null)

---

### Path 1: Handle File Upload to Zoho Drive

#### Step 1: Add Filter
- Add filter after Router
- Condition: `{{1.payment_slip}}` **exists**

#### Step 2: Convert Base64 to File
- Add **Tools → Base64** module (if available)
- OR use **HTTP → Make a Request** with Zoho Drive API

#### Step 3: Upload to Zoho Drive

**Option A: Using Zoho WorkDrive Module (Easiest)**

1. Add **Zoho WorkDrive → Upload a File**
2. Settings:
   - **Team:** Select your team
   - **Folder:** Select "Magazine Orders" folder
   - **File name:** `{{formatDate(now; "YYYYMMDD")}}_{{1.name}}_payment.{{if(contains(1.payment_slip.type; "pdf"); "pdf"; "jpg")}}`
   - **File data:** Map to Base64 decode of `{{1.payment_slip.data}}`

**Important:** You need to decode base64 first!

**Option B: Using Base64 Module**

1. Add **Tools → Base64 Encode/Decode**
   - Operation: **Decode**
   - Input: `{{1.payment_slip.data}}`
   - Encoding: `Base64`

2. Then add **Zoho WorkDrive → Upload a File**
   - **File name:** `{{formatDate(now; "YYYYMMDD")}}_{{1.name}}_payment.{{last(split(1.payment_slip.name; "."))}}`
   - **File data:** `{{2.data}}` (from the base64 decode)

3. **Save the file URL** for Google Sheets:
   - Store variable: `payment_slip_url` = `{{3.url}}` (from Zoho upload)

---

### Path 2: No File Uploaded

Just continue to Google Sheets with empty payment slip field.

---

## 📊 Update Google Sheets Module

After the Router paths merge, update your Google Sheets module:

**Column P (Payment Slip Link):**
- If file uploaded: `{{3.url}}` (from Zoho Drive)
- If no file: Leave empty or use: `Not provided`

**Use this formula in Make.com:**
```
{{if(1.payment_slip; 3.url; "Not provided")}}
```

---

## 🧪 Testing the File Upload

### Test Data (for Make.com "Run Once"):

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
  "order_date": "2024-11-02T10:30:00.000Z",
  "payment_slip": {
    "name": "test_payment.jpg",
    "type": "image/jpeg",
    "size": 45678,
    "data": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/..."
  }
}
```

*(Use a real small base64 string for actual testing)*

---

## 🔍 Troubleshooting

### "File is corrupted when downloaded from Zoho"
- **Solution:** Make sure you're decoding base64 before uploading
- The `data` field needs to be decoded from base64 to binary

### "Zoho Drive says invalid file"
- **Solution:** Check the base64 decode is working
- Verify the file extension matches the MIME type

### "File upload takes too long"
- **Solution:** Large files (>5MB) may take time
- Consider adding a timeout increase in Make.com

### "payment_slip is null even though I uploaded"
- **Solution:** Check browser console for errors
- Make sure file input has `name="payment_slip"`
- Hard refresh the page (Ctrl+Shift+R)

---

## 📝 Complete Make.com Flow

```
Webhook (receives JSON)
    ↓
Router
    ├─ Path 1: File exists
    │     ↓
    │  Base64 Decode
    │     ↓
    │  Upload to Zoho Drive
    │     ↓
    │  [continues to Google Sheets]
    │
    └─ Path 2: No file
          ↓
          [continues to Google Sheets]
    ↓
Add Row to Google Sheets
(with payment slip URL if available)
    ↓
Send Customer Email
    ↓
Send Seller Email
```

---

## 🎯 What Gets Saved in Zoho Drive

**File naming format:**
```
20241102_John_Doe_payment.jpg
20241102_Jane_Smith_payment.png
20241103_Bob_Wilson_payment.pdf
```

**Folder structure:**
```
Magazine Orders/
  ├── 20241102_Customer1_payment.jpg
  ├── 20241102_Customer2_payment.png
  ├── 20241103_Customer3_payment.pdf
  └── ...
```

**Optional:** Create subfolders by month
```
Magazine Orders/
  ├── 2024-11/
  │   ├── payment1.jpg
  │   └── payment2.png
  └── 2024-12/
      └── payment3.pdf
```

---

## 💡 Pro Tips

1. **Add file validation in Make.com too:**
   - Check file size
   - Verify MIME type
   - Scan for viruses (optional module)

2. **Create thumbnails:**
   - Use Image module to create thumbnails
   - Save both full-size and thumbnail

3. **Backup files:**
   - Also save to Google Drive as backup
   - Or email to yourself

4. **Track uploads:**
   - Add a "File Uploaded" column in Google Sheets
   - Mark as "Yes" or "No"

---

## 🎉 You're Done!

Now when customers:
1. Fill the form
2. Upload payment slip
3. Click "Complete Order"

The system will:
✅ Send all form data to Make.com  
✅ Include payment slip as base64  
✅ Make.com decodes and uploads to Zoho Drive  
✅ Save Zoho Drive URL to Google Sheets  
✅ Send confirmation emails  

**File is delivered with the form data!** 🚀

---

**Last Updated:** November 2024  
**Compatible with:** Make.com Free & Paid plans

