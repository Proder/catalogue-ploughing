# 🔐 Authentication Setup Guide

## Overview

Your application now has a complete authentication system using:
- **Email Whitelist** - Control who can access the catalogue
- **OTP (One-Time Password)** - 6-digit codes sent via email
- **Session Tokens** - 24-hour validity stored in browser

## ✅ Quick Setup

### Step 1: Create AllowedUsers Sheet

1. Open your Google Spreadsheet (ID: `YOUR_SPREADSHEET_ID_HERE`)
2. Create a new sheet named **`AllowedUsers`** (exact name, case-sensitive)
3. Add these headers in row 1:
   - **Column A**: `Email`
   - **Column B**: `Active`

4. Add authorized users:
   ```
   | Email                  | Active |
   |------------------------|--------|
   | pranavkhude19@gmail.com| TRUE   |
   | user@example.com       | TRUE   |
   ```

### Step 2: Deploy the Script

1. In Google Apps Script, click **Deploy** → **New deployment**
2. Select type: **Web app**
3. Configure:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy** and copy the web app URL
5. Update `VITE_API_BASE_URL` in your `.env` file

### Step 3: Test Authentication

1. Run your frontend: `npm run dev`
2. Enter an email from the AllowedUsers sheet
3. Click "Request Access Code"
4. Check your email for the 6-digit code
5. Enter the code to access the catalogue

## 🎯 How It Works

### Authentication Flow

```
1. User enters email
   ↓
2. Frontend calls checkEmail
   ↓
3. Backend checks AllowedUsers sheet
   ↓
4. If authorized → User clicks "Request Access Code"
   ↓
5. Frontend calls sendOTP
   ↓
6. Backend generates 6-digit code
   ↓
7. Code stored in cache (5 min expiry)
   ↓
8. Email sent to user
   ↓
9. User enters code
   ↓
10. Frontend calls verifyOTP
    ↓
11. Backend validates code
    ↓
12. Session token generated (24h validity)
    ↓
13. User gains access to catalogue
```

### API Endpoints

#### `GET ?action=checkEmail&email=xxx`
Checks if email is in the whitelist.

**Response:**
```json
{
  "success": true,
  "message": "Email authorized"
}
```

#### `POST action=sendOTP`
Generates and emails OTP code.

**Request:**
```json
{
  "action": "sendOTP",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Access code sent to your email"
}
```

#### `GET ?action=verifyOTP&email=xxx&otp=123456`
Verifies OTP and returns session token.

**Response:**
```json
{
  "success": true,
  "message": "Verified successfully",
  "sessionToken": "eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJleHBpcmVzIjoxNjQ...",
  "email": "user@example.com"
}
```

## 🔧 Configuration Options

### Backwards Compatibility

If the `AllowedUsers` sheet doesn't exist, the system **allows all emails** by default. This ensures your app doesn't break during migration.

To enable whitelist mode:
1. Create the `AllowedUsers` sheet
2. Add at least one authorized email
3. The system will automatically switch to whitelist mode

### OTP Settings

Current settings in `Code.gs`:
- **Code Length**: 6 digits
- **Expiry Time**: 5 minutes (300 seconds)
- **Storage**: CacheService (in-memory, automatic cleanup)
- **One-Time Use**: Codes are deleted after successful verification

To modify:
```javascript
// Change OTP expiry time (in seconds)
cache.put(`otp_${email.toLowerCase()}`, otp, 600); // 10 minutes

// Change session token validity (in milliseconds)
const expires = Date.now() + (48 * 60 * 60 * 1000); // 48 hours
```

### Email Customization

The OTP email template is in the `sendOTP()` function. Customize:
- Logo/branding
- Colors (currently: #36656b theme)
- Text content
- Footer message

## 🛡️ Security Features

✅ **Email Normalization** - Case-insensitive, trimmed  
✅ **One-Time Codes** - OTPs deleted after use  
✅ **Time-Limited** - 5-minute expiry for OTPs  
✅ **Session Management** - 24-hour tokens  
✅ **Whitelist Control** - Only authorized emails  

## 🧪 Testing Checklist

- [ ] Created `AllowedUsers` sheet
- [ ] Added your email with `Active = TRUE`
- [ ] Deployed Apps Script as web app
- [ ] Updated `.env` with web app URL
- [ ] Can request OTP for authorized email
- [ ] Receive OTP email within seconds
- [ ] Can verify OTP successfully
- [ ] Session persists after page reload
- [ ] Unauthorized email is rejected
- [ ] Expired OTP shows error message

## 🐛 Troubleshooting

### "Unknown action" Error
- ✅ **FIXED!** Your Code.gs now includes all auth endpoints

### Email Not Authorized
1. Check spelling in AllowedUsers sheet
2. Ensure `Active` column = `TRUE` (boolean or text)
3. Check for extra spaces in email

### OTP Not Received
1. Check spam/junk folder
2. Verify email address is correct
3. Check Apps Script execution logs

### OTP Expired
- OTPs expire in 5 minutes
- Request a new code and enter quickly

### Session Expired
- Sessions last 24 hours
- Clear browser localStorage and log in again

## 📋 AllowedUsers Sheet Schema

```
| Column | Name   | Type    | Description              |
|--------|--------|---------|--------------------------|
| A      | Email  | Text    | User email address       |
| B      | Active | Boolean | TRUE to allow access     |
```

**Example Data:**
```
A                       | B
------------------------|------
pranavkhude19@gmail.com | TRUE
john@company.com        | TRUE
old.user@example.com    | FALSE
```

## 🚀 Next Steps

Now that authentication is working:

1. **Add more users** to the AllowedUsers sheet
2. **Customize the OTP email** with your branding
3. **Test the full order flow** with authenticated users
4. **Deploy to production** and update FRONTEND_URL
5. **Monitor usage** via Apps Script logs

---

**Need Help?** Check the error logs in Google Apps Script: Extensions → Apps Script → Executions
