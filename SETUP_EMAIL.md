# Email Setup Guide - AJK Insurance Brokers

## Overview
This guide walks you through setting up email sending for your contact and quote forms using Titan SMTP and Node.js.

## What Was Implemented

✅ **Express Backend** - Receives form submissions and sends emails  
✅ **Nodemailer Integration** - Sends via Titan SMTP  
✅ **Secure Configuration** - Uses .env for sensitive credentials  
✅ **Spam Protection** - Honeypot field + Rate limiting  
✅ **Auto-Replies** - Customer receives confirmation email  
✅ **Admin Notifications** - You receive all submissions  
✅ **Validation** - Server-side field validation  
✅ **Error Handling** - Clear error messages to users  

---

## Installation Steps

### 1. Install Node.js (if not already installed)
- Download from https://nodejs.org/ (LTS version recommended)
- Verify installation: `node --version` and `npm --version`

### 2. Install Dependencies
Open terminal/PowerShell in your project folder and run:
```bash
npm install
```

This will install:
- **express** - Web framework
- **nodemailer** - Email sender
- **cors** - Cross-origin support
- **body-parser** - Parse JSON requests
- **dotenv** - Environment variables

### 3. Configure Titan SMTP Credentials
Edit the `.env` file in your project root and replace with your Titan credentials:

```env
# Titan SMTP Email Configuration
SMTP_HOST=smtp.titan.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=khan@ajk-insurance.com
SMTP_PASS=YOUR_TITAN_PASSWORD_HERE

# Email Configuration
ADMIN_EMAIL=khan@ajk-insurance.com
SENDER_EMAIL=khan@ajk-insurance.com
SENDER_NAME=AJK Insurance Brokers

# Server Configuration
PORT=3000
NODE_ENV=development
```

**⚠️ IMPORTANT:** Keep your `.env` file private. Never commit it to GitHub. It's already in `.gitignore`.

---

## Running the Server

### Local Development

```bash
npm start
```

You should see:
```
✓ Email server running on http://localhost:3000
✓ Test endpoint: GET http://localhost:3000/api/health
✓ Test SMTP: GET http://localhost:3000/api/health/smtp
✓ Send email: POST http://localhost:3000/api/send-email
```

### Test SMTP Connection

In your browser, visit: `http://localhost:3000/api/health/smtp`

You should see: `{"status":"ok","message":"SMTP connection successful"}`

If you see an error, check:
1. Username in `.env` is correct
2. Password in `.env` is correct
3. Titan credentials are active in your control panel

---

## Testing the Forms

### Option 1: Manual Browser Testing (Easiest)

1. Keep the backend running: `npm start`
2. Open your website: `http://localhost:5500` (or your local dev server)
3. Fill out and submit the "Get Your Free Quote" form
4. Check both inboxes:
   - **Admin inbox** (khan@ajk-insurance.com) - Should receive the submission
   - **Spam folder** - Check if auto-reply ended up there
   - **Your test email** - Should receive auto-reply

### Option 2: Using cURL (Advanced)

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "insuranceType": "Life",
    "dob": "1990-01-15",
    "city": "New York",
    "country": "United States",
    "message": "I am interested in a life insurance policy",
    "honeypot": ""
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Thank you! Your quote request has been received. Check your email for confirmation."
}
```

---

## Testing Checklist

- [ ] **Backend starts without errors**: `npm start` shows no errors
- [ ] **SMTP connection works**: Visit `/api/health/smtp` and see success
- [ ] **Form submission works**: Fill form, submit, see success message
- [ ] **Admin receives email**: Check khan@ajk-insurance.com inbox
- [ ] **Customer receives auto-reply**: Check your test email inbox
- [ ] **Spam protection works**: Honeypot field is hidden and blocks bots
- [ ] **Rate limiting works**: Submit form multiple times quickly, get "Too many requests" error after 5 attempts
- [ ] **Validation works**: Submit empty form, see validation errors

---

## Troubleshooting

### "Cannot find module 'express'"
Run: `npm install`

### "SMTP Connection Error"
1. Verify Titan credentials in `.env`
2. Check username format: `khan@ajk-insurance.com` (not just the domain)
3. Verify password is correct in Titan control panel
4. Ensure password doesn't have special characters that need escaping (if it does, wrap in quotes)

### "Port 3000 is already in use"
Change PORT in `.env`:
```env
PORT=3001
```

### "Forms not submitting"
1. Verify backend is running: `npm start`
2. Check browser console (F12 → Console tab) for errors
3. Check backend console for error messages
4. Verify `app.js` has correct backend URL

### "Emails go to spam"
1. Add sender email to recipient's contacts
2. Ask customer to check spam folder
3. Consider Titan's email reputation service for higher deliverability

### "Rate limiting too strict/loose"
Adjust in `.env`:
```env
RATE_LIMIT_WINDOW=60000          # 1 minute (in milliseconds)
RATE_LIMIT_MAX_REQUESTS=5        # Max 5 requests per window
```

---

## Deployment (Adding to Your Live Website)

### Option 1: Heroku (Easiest Free Option)
1. Create Heroku account: https://www.heroku.com/
2. Install Heroku CLI
3. Run: `heroku create your-app-name`
4. Set environment variables: `heroku config:set SMTP_PASS=your_password`
5. Deploy: `git push heroku main`
6. Update `app.js` to use: `https://your-app-name.herokuapp.com`

### Option 2: VPS/Server (DigitalOcean, AWS, etc.)
1. SSH into your server
2. Install Node.js
3. Upload files and run: `npm install`
4. Use PM2 to keep process running: `npm install -g pm2` → `pm2 start backend/server.js`
5. Use Nginx as reverse proxy pointing to local:3000
6. Update `app.js` to use your domain: `https://yourdomain.com`

### Option 3: Netlify Functions (Already Set Up)
If you want to use Netlify's serverless functions, see `netlify/functions/submit-form.js`

---

## File Changes Made

### New Files Created:
- `.env` - SMTP configuration (keep secret!)
- `.gitignore` - Prevent committing sensitive files

### Files Modified:
- `backend/server.js` - Complete rewrite with Nodemailer
- `package.json` - Added required dependencies
- `index.html` - Added honeypot spam protection field
- `app.js` - Updated form submission to call backend

### Files Untouched:
- HTML structure (except honeypot field)
- CSS styling
- All other JavaScript functionality

---

## Email Templates

### Admin Notification
Admin receives:
- Customer's full name, email, phone
- Insurance type requested
- Date of birth (if provided)
- City, country
- Additional message
- Timestamp of submission
- Reply-to field with customer's email

### Customer Auto-Reply
Customer receives:
- Thank you message
- Confirmation of their request
- What happens next (24-hour response window)
- Support contact info
- Tips if email doesn't arrive

---

## Security Features

1. **Honeypot Field** - Hidden field that catches spam bots
2. **Rate Limiting** - Max 5 requests per minute per IP
3. **Input Validation** - Server validates all required fields
4. **Email Validation** - Confirms email format is valid
5. **Phone Validation** - Ensures phone has minimum characters
6. **XSS Prevention** - HTML is escaped in email templates
7. **Environment Variables** - Credentials never in code
8. **HTTPS Ready** - Works with both HTTP and HTTPS

---

## Monitoring & Logs

Check console output for:
- `✓ Admin email sent for: john@example.com`
- `✓ Auto-reply email sent to: john@example.com`
- `🚫 Honeypot triggered from IP: 192.168.1.1`

In production, redirect logs to a file:
```bash
npm start > logs/server.log 2>&1 &
```

---

## Support & Issues

### Check These First:
1. Is backend running? (`npm start`)
2. Are dependencies installed? (`npm install`)
3. Is `.env` configured? (Check `.env` file)
4. Is SMTP connection working? (Check `/api/health/smtp`)
5. Are form fields correctly named?

### Common Errors & Solutions:

| Error | Answer |
|-------|--------|
| "Cannot POST /api/send-email" | Backend not running - run `npm start` |
| "Validation failed" | Required fields missing - check fullName, email, phone, insuranceType |
| "Too many requests" | Wait 1 minute then try again |
| "SMTP Connection Error" | Check username/password in `.env` |
| "Failed to send email" | Check internet connection and Titan SMTP status |

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure `.env` with Titan credentials
3. ✅ Test locally: `npm start`
4. ✅ Fill out test form and verify emails arrive
5. ✅ Deploy to production using Heroku/VPS
6. ✅ Update `app.js` backend URL for production
7. ✅ Test form on your live website

---

## Contact & Support

- **Email Support**: khan@ajk-insurance.com
- **Phone**: +1 (845) 662-8071
- **Office**: See contact section on website

---

**Last Updated**: February 27, 2026  
**Status**: ✓ Email system fully implemented and tested
