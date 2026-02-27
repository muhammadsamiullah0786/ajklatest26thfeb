# TROUBLESHOOTING GUIDE - Form Submission Error

## ❌ Error: "Something went wrong. Please try again..."

This means the form couldn't reach the backend or the backend had an error.

---

## 🔍 STEP-BY-STEP DIAGNOSIS

### STEP 1: Is the Backend Running?

Open PowerShell/Terminal and run:
```bash
npm start
```

✅ **Expected output**:
```
✓ Email server running on http://localhost:3000
✓ SMTP connection ready
```

❌ **If you see errors**, check:
- Did you install dependencies? `npm install`
- Does .env file exist? Check `c:\Users\Sami\AJK\.env`
- Is port 3000 available?

---

### STEP 2: Test SMTP Connection

With backend running, open this in browser:
```
http://localhost:3000/api/health/smtp
```

✅ **Should see**:
```json
{"status":"ok","message":"SMTP connection successful"}
```

❌ **If you see error**, check:
1. **Missing .env file** → Ensure `.env` exists in project root
2. **Wrong password** → Edit `.env` and verify Titan password is correct
3. **Email not active** → Check Titan control panel: khan@ajk-insurance.com is active

---

### STEP 3: Check Browser Console

While on your website form page:
1. Press **F12** (or right-click → Inspect)
2. Go to **Console** tab
3. Submit the form
4. Look for red error messages

**Post the error here** - it will tell us exactly what's wrong.

Common errors:
- `Failed to fetch` → Backend not running
- `CORS error` → Backend CORS settings need update
- `Validation failed` → Missing required fields

---

### STEP 4: Check Backend Console

Look at the PowerShell terminal where you ran `npm start`.

**Look for** (examples):

✅ **Good signs**:
```
✓ Admin email sent for: john@example.com
✓ Auto-reply email sent to: john@example.com
```

❌ **Bad signs**:
```
❌ SMTP Connection Error: Invalid login
🚫 Honeypot triggered from IP: 192.168.1.1
Email sending error: ...
```

---

## 🔧 MOST COMMON FIXES

### Issue #1: Backend Not Running
**Fix**:
```bash
npm start
```

### Issue #2: SMTP Password Not Set
**Check .env file**:
```bash
# Open .env
notepad .env
```

Make sure you have:
```env
SMTP_PASS=YOUR_ACTUAL_PASSWORD_HERE
```
(Not "YOUR_TITAN_PASSWORD_HERE" - that's a placeholder!)

### Issue #3: Dependencies Not Installed
**Fix**:
```bash
npm install
```

### Issue #4: Port 3000 Already Used
**Fix**: Edit `.env`:
```env
PORT=3001
```
Then restart: `npm start`

### Issue #5: Form Fields Not Filled
**Fix**: Make sure you filled:
- ✓ Full Name
- ✓ Email
- ✓ Phone
- ✓ Insurance Type

---

## 🧪 MANUAL CURL TEST

To test backend directly (copy-paste into PowerShell):

```powershell
$body = @{
    fullName = "Test User"
    email = "test@example.com"
    phone = "(555) 123-4567"
    insuranceType = "Life"
    dob = "1990-01-15"
    city = "New York"
    country = "United States"
    message = "Test message"
    honeypot = ""
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/send-email" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

This tells us exactly what the backend is returning.

---

## 📋 COMPLETE CHECKLIST

- [ ] Backend running (`npm start` shows no errors)
- [ ] SMTP test works (`/api/health/smtp` returns success)
- [ ] .env file exists with Titan password
- [ ] All form fields filled (Name, Email, Phone, Insurance Type)
- [ ] Browser console (F12) shows no red errors
- [ ] Port 3000 is available
- [ ] Dependencies installed (`npm install`)

---

## 🎯 WHAT NEEDS TO HAPPEN

Before form works, BOTH must be true:

1. **Backend must be running**
   ```bash
   npm start
   ```

2. **SMTP credentials must be set**
   - Edit `.env`
   - Set `SMTP_PASS=YOUR_PASSWORD`

If both are true and you still get error, run:
```bash
node test-email-system.js
```

This will test everything automatically.

---

## 📞 SPECIFIC ERROR? 

**Tell me**:
1. What error message do you see in browser console? (F12)
2. What do you see in PowerShell where you ran `npm start`?
3. Did you add your password to `.env`?
4. Did you run `npm install`?

Post these details and I'll fix it!

---

## ⚡ QUICK FIX ORDER

Try these in order:

1. `npm install` ← Install dependencies
2. Edit `.env` ← Add password
3. `npm start` ← Start server
4. Open http://localhost:3000/api/health/smtp ← Test SMTP
5. Reload website form ← Try again
6. `node test-email-system.js` ← Run tests

If this doesn't work, copy-paste your errors and I'll diagnose.
