# Debug File Upload Guide

## 🔍 Testing the File Upload

### Step 1: Open Browser Console
1. Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
2. Click on the **Console** tab
3. Keep it open while testing

### Step 2: Fill Form and Upload File
1. Fill out all form fields
2. **Click "Show QR Code"** button
3. Upload a payment slip image (JPG or PNG)
   - You should see the filename appear
4. Click **"Complete Order"**

### Step 3: Check Console Logs

You should see these logs in the console:

```javascript
// 1. File check
File input check: {
  hasFile: true,
  fileName: "payment_screenshot.jpg",
  fileSize: 234567,
  fileType: "image/jpeg"
}

// 2. Processing confirmation
Processing file: payment_screenshot.jpg

// 3. Base64 conversion complete
Base64 conversion complete, length: 312756

// 4. Payment slip added
Payment slip added to order data: {
  name: "payment_screenshot.jpg",
  type: "image/jpeg",
  size: 234567,
  dataLength: 312756
}

// 5. Final payload (before sending)
Sending to Make.com: {
  name: "Peppe Pet",
  email: "testing@cp.com",
  // ... all fields ...
  payment_slip: {
    name: "payment_screenshot.jpg",
    type: "image/jpeg",
    size: 234567,
    data: "[BASE64 DATA - 312756 chars]"
  }
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "No payment slip file detected"
**Symptoms:** Console shows `hasFile: false`

**Solutions:**
1. Make sure you actually selected a file
2. Check that file input shows the filename
3. Try clicking the file input again and selecting file
4. Hard refresh page: `Ctrl+Shift+R`

### Issue 2: File shows in console but still "empty" in Make.com
**Symptoms:** Console shows file data, but Make.com receives `null`

**Solutions:**
1. Check Make.com webhook is set to receive JSON (not form data)
2. Verify webhook URL is correct
3. Check Make.com execution log for errors
4. Make sure base64 data is being included (check character length)

### Issue 3: "Invalid file type" error
**Symptoms:** Error message appears when uploading

**Solutions:**
1. Only use JPG, PNG, or PDF files
2. Check file extension matches type
3. Rename file to simple name: `payment.jpg`
4. Try a different image

### Issue 4: File too large
**Symptoms:** Upload fails or is very slow

**Solutions:**
1. Compress/resize image before uploading
2. Use phone camera in lower quality
3. Screenshot should be < 2MB ideally
4. Maximum is 10MB

---

## 🧪 Test with These Files

### Good Test Files:
- ✅ Phone screenshot (usually 200KB - 1MB)
- ✅ Digital receipt screenshot
- ✅ JPG from camera
- ✅ PNG screenshot
- ✅ PDF bank statement

### Bad Test Files:
- ❌ RAW camera files (too large)
- ❌ HEIC files (not supported)
- ❌ Word documents
- ❌ Excel files
- ❌ Zip files

---

## 📱 Mobile Testing

### iOS:
1. Take screenshot: `Power + Volume Up`
2. Screenshot is automatically in Photos
3. Use in browser file picker

### Android:
1. Take screenshot: `Power + Volume Down`
2. Screenshot is in Gallery
3. Use in browser file picker

**Note:** Mobile browsers handle file upload differently - test on actual device!

---

## 🔧 Advanced Debugging

### Check if file is actually selected:
```javascript
// In browser console, paste this:
document.getElementById('payment_slip').files[0]
```

Should show: `File {name: "...", size: ..., type: "..."}`
Should NOT show: `undefined`

### Check form data:
```javascript
// In console:
const form = document.getElementById('orderForm');
const formData = new FormData(form);
console.log('All form values:', Object.fromEntries(formData));
```

### Manual test of file reading:
```javascript
// In console:
const fileInput = document.getElementById('payment_slip');
const file = fileInput.files[0];
const reader = new FileReader();
reader.onload = (e) => console.log('Base64 length:', e.target.result.length);
reader.readAsDataURL(file);
```

---

## 🎯 Expected Behavior

### When File IS Selected:
1. Label changes to show filename and size
2. Console shows `hasFile: true`
3. Button shows "Uploading file..." briefly
4. Console shows base64 conversion
5. Make.com receives payment_slip object with data

### When File is NOT Selected:
1. Label stays as "Upload Payment Slip..."
2. Console shows `hasFile: false`
3. Console shows "No payment slip file detected"
4. Make.com receives `payment_slip: null`

**Both scenarios should work!** File is optional.

---

## 📊 Make.com Webhook Format

Make.com should receive JSON like this:

```json
{
  "name": "Customer Name",
  "email": "test@example.com",
  "phone": "0812345678",
  "address_line": "...",
  "building": "...",
  "street": "...",
  "subdistrict": "...",
  "district": "...",
  "province": "...",
  "postal_code": "12120",
  "country": "Thailand",
  "order_type": "magazine_order",
  "product": "Now Or Never 420 Magazine",
  "price": "1420",
  "currency": "THB",
  "order_date": "2024-11-02T08:56:00.000Z",
  "payment_slip": {
    "name": "screenshot.jpg",
    "type": "image/jpeg",
    "size": 234567,
    "data": "very_long_base64_string_here..."
  }
}
```

### In Make.com Webhook Module:
- Click on webhook
- Click "Show data"
- You should see all these fields
- `payment_slip.data` should be a very long string (thousands of characters)

---

## ✅ Checklist

Before reporting an issue, verify:

- [ ] Hard refreshed page (Ctrl+Shift+R)
- [ ] Opened browser console (F12)
- [ ] Selected a JPG or PNG file
- [ ] File is under 10MB
- [ ] Saw filename appear after selecting
- [ ] Checked console logs during submit
- [ ] Checked Make.com webhook execution log
- [ ] Verified webhook URL is correct
- [ ] Tried with a different image

---

## 🆘 Still Not Working?

### Share these details:

1. **Console output** (copy all logs)
2. **File details** (name, size, type)
3. **Make.com response** (what it received)
4. **Browser used** (Chrome, Firefox, Safari, etc.)
5. **Device type** (Desktop, Mobile, iOS, Android)

### Quick Fix Attempts:

1. **Try a different browser** (Chrome recommended)
2. **Try a different image** (simple JPG screenshot)
3. **Disable browser extensions** (might block upload)
4. **Check file permissions** (can browser read the file?)
5. **Try on different device** (mobile vs desktop)

---

**Last Updated:** November 2024  
**Works Best On:** Chrome, Firefox, Edge, Safari (latest versions)

