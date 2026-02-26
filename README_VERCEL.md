AJK Insurance Brokers — Vercel Deployment Guide

📧 EMAIL CONFIGURATION FOR VERCEL

Required Environment Variables (in Vercel Dashboard):
- GMAIL_USER = Khan@ajkinsurancebrokersllc.com
- GMAIL_APP_PASSWORD = [Your 16-character App Password]
- RECIPIENT_EMAIL = Khan@ajkinsurancebrokersllc.com

🔐 How to Generate Google App Password:

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to Security → 2-Step Verification (enable if not already)
3. Scroll down to "App passwords"
4. Click "Select app" → Choose "Mail"
5. Click "Select device" → Choose "Other" → Type "Vercel"
6. Click "Generate"
7. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)
   - Remove spaces when adding to Vercel: xxxxxxxxxxxxxxxx

🚀 VERCEL DEPLOYMENT STEPS:

Method 1: Deploy via Vercel Dashboard
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. In "Environment Variables", add:
   - GMAIL_USER
   - GMAIL_APP_PASSWORD
   - RECIPIENT_EMAIL
5. Click "Deploy"

Method 2: Deploy via Vercel CLI
1. Install Vercel CLI: npm i -g vercel
2. Navigate to project folder: cd c:\Users\Sami\AJK
3. Run: vercel
4. Follow prompts to link project
5. Add environment variables in Vercel Dashboard
6. Deploy: vercel --prod

✅ TESTING EMAIL FUNCTIONALITY:

1. After deployment, visit your Vercel URL
2. Fill out the Online Application form
3. Submit the form
4. Check Khan@ajkinsurancebrokersllc.com inbox
5. You should receive a formatted email with all lead details

🔧 LOCAL TESTING:

1. Install dependencies: npm install
2. Create .env file in root:
   GMAIL_USER=Khan@ajkinsurancebrokersllc.com
   GMAIL_APP_PASSWORD=your_app_password_here
   RECIPIENT_EMAIL=Khan@ajkinsurancebrokersllc.com

3. Install Vercel CLI: npm i -g vercel
4. Run locally: vercel dev
5. Open http://localhost:3000
6. Test the form

📁 PROJECT STRUCTURE:

/api
  └── submit-form.js       (Vercel serverless function)
/assets                    (images)
index.html                 (main page)
styles.css                 (styles with animations)
app.js                     (client-side JS)
vercel.json                (Vercel configuration)
package.json               (dependencies: nodemailer)

📝 NOTES:

- If using Google Workspace, ensure App Passwords are enabled by admin
- Test emails may go to spam initially - mark as "Not Spam"
- Form data is sent immediately, no database storage
- All form validation happens on both client and server side

🆘 TROUBLESHOOTING:

1. "Email service not configured" → Check environment variables in Vercel
2. "Authentication failed" → Regenerate App Password
3. "Form timeout" → Check Vercel function logs
4. Emails not arriving → Check spam folder, verify recipient email

For support: contact@ajkinsurancebrokersllc.com
