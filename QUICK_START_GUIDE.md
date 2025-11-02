# Quick Start Guide - Magazine Shop Setup

## 🚀 Getting Started in 15 Minutes

This guide will get your shop running quickly!

---

## Step 1: Set Up Make.com Webhook (5 minutes)

1. **Create Make.com Account**
   - Go to https://www.make.com/en/register
   - Sign up for free account (1,000 operations/month)

2. **Create New Scenario**
   - Click "Create a new scenario"
   - Add "Webhooks → Custom Webhook" module
   - Click "Add" to create webhook
   - **COPY THE WEBHOOK URL** (you'll need this!)

3. **Test the Webhook**
   - Click "Run once" at the bottom
   - The webhook will wait for data
   - Keep this tab open

---

## Step 2: Update Your Website (2 minutes)

1. **Update the webhook URL in script.js:**

```javascript
// Line 214 in script.js
const makeWebhookUrl = 'PASTE_YOUR_WEBHOOK_URL_HERE';
```

2. **Save the file**

---

## Step 3: Test Your First Order (3 minutes)

1. **Open your website** in a browser
2. **Go to the Shop section**
3. **Fill out the form** with test data:
   - Name: Test Customer
   - Email: your-email@example.com
   - Phone: 0812345678
   - Address: Complete all fields
   - Upload a small test image as payment slip

4. **Submit the form**

5. **Check Make.com**
   - You should see the data appear in Make.com!
   - This confirms the connection is working ✅

---

## Step 4: Connect Google Sheets (5 minutes)

1. **Create a Google Sheet**
   - Go to https://sheets.google.com
   - Create new spreadsheet named "Magazine Orders"
   - Add these columns in Row 1:

   ```
   Order ID | Order Date | Name | Email | Phone | Address Line | Building | Street | Subdistrict | District | Province | Postal Code | Country | Price | Status | Payment Slip
   ```

2. **Add Google Sheets to Make.com**
   - In your scenario, after the Webhook module
   - Add "Google Sheets → Add a Row"
   - Connect your Google account
   - Select your spreadsheet
   - Map the fields:
     - Column A (Order ID): `ORD-{{formatDate(now; "YYYYMMDD")}}-{{substring(1.uuid; 1; 6)}}`
     - Column B (Order Date): `{{formatDate(now; "YYYY-MM-DD HH:mm:ss")}}`
     - Column C (Name): `{{1.name}}`
     - Column D (Email): `{{1.email}}`
     - Column E (Phone): `{{1.phone}}`
     - Column F (Address Line): `{{1.address_line}}`
     - Column G (Building): `{{1.building}}`
     - Column H (Street): `{{1.street}}`
     - Column I (Subdistrict): `{{1.subdistrict}}`
     - Column J (District): `{{1.district}}`
     - Column K (Province): `{{1.province}}`
     - Column L (Postal Code): `{{1.postal_code}}`
     - Column M (Country): `{{1.country}}`
     - Column N (Price): `{{1.price}}`
     - Column O (Status): `Pending`
     - Column P (Payment Slip): (leave empty for now)

3. **Test it!**
   - Submit another test order
   - Check your Google Sheet
   - You should see a new row! ✅

---

## Step 5: Connect Zoho Drive (Optional - 5 minutes)

If you want to upload payment slips to Zoho Drive:

1. **Setup Zoho Drive**
   - Create folder: "Magazine Orders"
   - Get folder ID from URL

2. **Add to Make.com**
   - Add "Zoho Drive → Upload a File" module
   - Connect your Zoho account
   - Select the folder
   - File name: `{{2.order_id}}_payment`
   - File data: `{{1.payment_slip.data}}`

3. **Update Google Sheets**
   - In Column P (Payment Slip), add: `{{3.url}}`

---

## Step 6: Set Up Email Notifications (Optional - 5 minutes)

### For Customer Confirmation:

1. **Add Zoho Mail Module**
   - Add "Zoho Mail → Send an Email"
   - From: info@nowornevermagazine.com
   - To: `{{1.email}}`
   - Subject: `Order Confirmation - Your Magazine is on the way!`
   - Body: (Use the template from MAKE_COM_SETUP_GUIDE.md)

### For Seller Notification:

1. **Add Another Email Module**
   - Add "Zoho Mail → Send an Email"
   - From: info@nowornevermagazine.com
   - To: info@nowornevermagazine.com
   - Subject: `New Order: {{1.name}}`
   - Body: Simple notification with order details

---

## 🎉 You're Done!

Your shop is now live and ready to accept orders!

---

## What Happens When Someone Orders:

1. ✅ Customer fills out form
2. ✅ JavaScript validates all data
3. ✅ Data sent to Make.com webhook
4. ✅ Order saved to Google Sheets
5. ✅ Payment slip uploaded to Zoho Drive (if configured)
6. ✅ Customer receives confirmation email (if configured)
7. ✅ You receive notification email (if configured)

---

## Next Steps

Once you have the basics working:

1. **Read the Full Guide**
   - Check out `MAKE_COM_SETUP_GUIDE.md` for detailed setup
   - Review `SHOP_SECURITY_CHECKLIST.md` for security best practices

2. **Customize Email Templates**
   - Make them match your brand
   - Add your logo
   - Personalize the message

3. **Test Thoroughly**
   - Try different browsers
   - Test on mobile devices
   - Test with different file types

4. **Monitor Daily**
   - Check Google Sheets for new orders
   - Review Make.com for errors
   - Respond to customer emails

---

## Common Issues & Solutions

### "Webhook not receiving data"
- ✅ Check if webhook URL is correct in script.js
- ✅ Make sure scenario is "ON" in Make.com
- ✅ Check browser console for errors (F12)

### "Google Sheets not updating"
- ✅ Check if Google Sheets module is connected
- ✅ Verify column mapping is correct
- ✅ Check Make.com execution log for errors

### "Email not sending"
- ✅ Verify Zoho Mail is connected in Make.com
- ✅ Check sender email is configured in Zoho
- ✅ Check spam folder

### "File upload failing"
- ✅ Check file size (must be under 10MB)
- ✅ Verify file type (JPG, PNG, or PDF only)
- ✅ Check Zoho Drive permissions

---

## Support

- **Make.com Help:** https://www.make.com/en/help
- **Google Sheets API:** https://developers.google.com/sheets
- **Zoho Documentation:** https://www.zoho.com/mail/help/

---

## Cost Breakdown

- **Make.com Free:** 1,000 operations/month (~100-200 orders)
- **Google Sheets:** Free
- **Zoho Mail:** Free or $1/month per user
- **Zoho Drive:** 5GB free

**Total Cost:** $0-1/month for starting out!

---

**Last Updated:** November 2024  
**Ready to Scale:** Yes! Just upgrade Make.com plan when needed.

---

## 🎯 Your Current Setup Status

You have already completed:
- ✅ Form HTML with validation
- ✅ JavaScript with security checks
- ✅ File upload protection (.htaccess)
- ✅ Configuration files
- ✅ Documentation

Still needed:
- ⏳ Set up Make.com scenario
- ⏳ Connect Google Sheets
- ⏳ Configure Zoho Mail
- ⏳ Test end-to-end

**You're 80% done! Just need to configure Make.com!**

