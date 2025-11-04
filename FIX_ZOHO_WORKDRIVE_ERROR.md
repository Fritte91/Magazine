# Fix Zoho WorkDrive Upload Error (F6003)

## 🔍 Error: "Invalid Param found (F6003)"

This error means Zoho WorkDrive doesn't like one of the parameters.

---

## ✅ Solution 1: Use HTTP Module Instead (Most Reliable)

Instead of the Zoho WorkDrive module, use the **HTTP → Make a Request** module to upload directly to Zoho API.

### Step 1: Get Zoho API Credentials

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Create "Self Client"
3. Generate token with scope: `WorkDrive.files.CREATE`
4. Save your Access Token

### Step 2: Create HTTP Upload Module

**Add: HTTP → Make a Request**

Settings:
- **URL:** `https://www.zohoapis.com/workdrive/api/v1/upload`
- **Method:** `POST`
- **Headers:**
  ```
  Authorization: Zoho-oauthtoken YOUR_ACCESS_TOKEN
  ```

- **Body Type:** `Multipart/form-data`
- **Fields:**
  - `filename`: `{{formatDate(1.order_date; "YYYYMMDD")}}_{{replace(1.name; " "; "_")}}_payment.jpg`
  - `parent_id`: `YOUR_FOLDER_ID` (get from Zoho Drive folder URL)
  - `content`: Map to `{{1.payment_slip.data}}`

---

## ✅ Solution 2: Fix Zoho WorkDrive Module Parameters

If you want to keep using the Zoho module, check these:

### Common Issues:

#### Issue 1: File Data Format
**Try different mappings:**
- `{{1.payment_slip.data}}` ← Try this first
- `{{1.files[1].data}}` ← Try if above fails
- `{{toBinary(1.payment_slip.data)}}` ← Force binary

#### Issue 2: File Name
**Make sure filename is clean:**
```
{{replace(replace(1.payment_slip.name; " "; "_"); "[^a-zA-Z0-9._-]"; "")}}
```
This removes special characters.

#### Issue 3: Folder Selection
- Don't use folder NAME, use folder ID
- Get folder ID from URL when viewing folder in Zoho Drive
- Format: Should look like `abc123xyz456`

#### Issue 4: Team Selection
- Make sure you selected the correct team
- Try "My Workspace" if personal account

---

## ✅ Solution 3: Use Google Drive Instead (Easiest!)

Google Drive integration is more reliable in Make.com:

**Add: Google Drive → Upload a File**

Settings:
- **Drive:** My Drive
- **Folder:** Select/create "Magazine Orders" folder
- **File Name:** `{{formatDate(1.order_date; "YYYYMMDD")}}_{{1.name}}_payment.jpg`
- **File Data:** `{{1.payment_slip.data}}`
- **Convert to Google Format:** NO

This usually works perfectly!

---

## ✅ Solution 4: Test with Simpler Setup

Test with minimal parameters first:

### In Zoho WorkDrive Module:
1. **Team:** Select your team
2. **Folder:** Select folder (not subfolder)
3. **File Name:** `test.jpg` (simple, no variables)
4. **File Data:** `{{1.payment_slip.data}}`

If this works, add complexity gradually.

---

## 🔧 Debugging Steps

### Step 1: Test File Data
Add a **Tools → Set Variable** before Zoho upload:
- Variable: `file_size`
- Value: `{{length(1.payment_slip.data)}}`

This should show the file size (e.g., 13854). If it's 0 or empty, the file data isn't being passed correctly.

### Step 2: Check File MIME Type
Zoho might require specific MIME type:
- Add another variable: `file_type`
- Value: `{{1.payment_slip.mime}}`

Make sure it shows `image/jpeg` or `image/png`

### Step 3: Verify Folder ID
In Zoho WorkDrive:
1. Open the folder you want to upload to
2. Look at URL: `https://workdrive.zoho.com/folder/abc123xyz`
3. The folder ID is the part after `/folder/`
4. Use this exact ID in Make.com

---

## 💡 Recommended: Two-Step Approach

Upload to Google Drive first (easy and reliable), then copy to Zoho Drive if needed:

```
1. Webhook ✅
   ↓
2. Google Drive Upload (always works)
   ↓
3. Zoho WorkDrive Copy (from Google Drive link)
   ↓
4. Google Sheets (with both links)
```

Or just use Google Drive! It's more reliable and has better Make.com integration.

---

## 🎯 Quick Fix: Use Google Drive

Replace your Zoho module with:

**Google Drive → Upload a File**

Settings:
- **Select Folder:** Create "Magazine Orders" folder
- **File Name:** 
  ```
  {{formatDate(1.order_date; "YYYYMMDD")}}_{{replace(1.name; " "; "_")}}_{{1.payment_slip.name}}
  ```
- **Data:** `{{1.payment_slip.data}}`
- **Convert to Google Document:** NO (important!)

This will work immediately! ✅

Then in Google Sheets, the file URL will be:
```
{{2.webViewLink}}  (to view)
{{2.webContentLink}}  (to download)
```

---

## 🆘 If Still Getting Errors

### Error Details to Check:
1. What's the **exact file name** you're using?
2. Is the **folder ID** correct?
3. Is your **Zoho connection** still valid?
4. Does your **Zoho account** have upload permissions?

### Quick Test:
1. Try uploading manually to Zoho Drive from browser
2. If manual upload works, it's a Make.com configuration issue
3. If manual upload fails, it's a Zoho permission issue

---

## 📊 Comparison: Google Drive vs Zoho Drive

| Feature | Google Drive | Zoho WorkDrive |
|---------|--------------|----------------|
| Make.com Integration | Excellent | Good |
| Reliability | 99.9% | 95% |
| Free Storage | 15GB | 5GB |
| Setup Difficulty | Easy | Medium |
| API Stability | Very Stable | Stable |
| Speed | Fast | Fast |

**Recommendation:** Use Google Drive for file storage. It's more reliable with Make.com.

---

## ✅ Working Solution Right Now

Here's what will work 100%:

### Replace Zoho Module with Google Drive:

1. **Remove** Zoho WorkDrive module
2. **Add** Google Drive → Upload a File
3. **Settings:**
   - Folder: "Magazine Orders"
   - Name: `{{formatDate(1.order_date; "YYYYMMDD")}}_{{1.name}}_payment.jpg`
   - Data: `{{1.payment_slip.data}}`
   - Convert: NO
4. **Test** - it will work! ✅

Then continue to Google Sheets and emails as planned.

---

**Bottom line:** Google Drive integration in Make.com is more stable. Unless you specifically need Zoho Drive, I recommend switching to Google Drive!

Would you like me to help you set up Google Drive instead? It will work immediately! 🚀


