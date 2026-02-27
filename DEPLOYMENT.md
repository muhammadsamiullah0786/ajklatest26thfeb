# DEPLOYMENT GUIDE - Production Setup

## Choose Your Deployment Option

---

## Option 1: HEROKU (⭐ EASIEST - Recommended for beginners)

### Why Heroku?
- Free tier available
- Simple deployment workflow
- Auto-scaling
- Great for small-to-medium traffic

### Steps:

#### 1. Create Heroku Account
- Sign up at https://www.heroku.com/
- Verify email

#### 2. Install Heroku CLI
- Download: https://devcenter.heroku.com/articles/heroku-cli
- Verify: `heroku --version`

#### 3. Create Heroku App
```bash
heroku login
heroku create your-app-name
```
(Replace `your-app-name` with something unique like `ajk-email-api`)

#### 4. Deploy Code
```bash
git push heroku main
```

#### 5. Set Environment Variables
```bash
heroku config:set SMTP_PASS=YOUR_TITAN_PASSWORD
heroku config:set ADMIN_EMAIL=khan@ajk-insurance.com
heroku config:set NODE_ENV=production
```

#### 6. View Logs
```bash
heroku logs --tail
```

#### 7. Update Frontend URL
In `app.js`, change:
```javascript
return 'https://your-app-name.herokuapp.com';
```

### Cost
- Free tier: 550 free dyno hours/month
- Paid tier: $7/month (always running)

### Limitations
- Free tier sleeps after 30 min inactivity
- Limited dynos
- Perfect for small sites

---

## Option 2: RAILWAY.APP (💰 Popular Alternative)

### Why Railway?
- Generous free tier
- Pay-as-you-go pricing
- Very easy deployment
- Better performance than Heroku free

### Steps:

#### 1. Create Account
- Sign up at https://railway.app/
- Connect GitHub

#### 2. Deploy Repository
- Click "New Project"
- Select "Deploy from GitHub repo"
- Select your fork

#### 3. Set Environment Variables
- In Railway dashboard
- Go to Variables tab
- Add:
  - `SMTP_PASS` = your titan password
  - `NODE_ENV` = production
  - `PORT` = 3000

#### 4. Get Public URL
- Railway generates a domain automatically
- Copy the URL

#### 5. Update Frontend
In `app.js`:
```javascript
return 'https://your-railway-domain.app';
```

### Cost
- $5 free tier credit/month
- Then $0.50 per GB used
- Usually very cheap

---

## Option 3: RENDER.COM (Free)

### Why Render?
- Truly free tier
- Auto-deploys from GitHub
- Easy setup

### Steps:

#### 1. Create Account
- Sign up at https://render.com/
- Connect GitHub

#### 2. Create Web Service
- Click "New Web Service"
- Select your GitHub repo
- Name it: `ajk-email-api`

#### 3. Configure
- Environment: Node
- Build Command: `npm install`
- Start Command: `npm start`
- Instance Type: Free

#### 4. Add Environment Variables
- Go to Environment tab
- Add:
  - `SMTP_PASS`
  - `ADMIN_EMAIL`
  - `NODE_ENV=production`

#### 5. Deploy
- Render auto-deploys when you push to GitHub

#### 6. Get URL & Update
- Your public URL will be: `https://ajk-email-api.onrender.com`
- Update `app.js`

### Cost
- Free tier: Limited resources, sleeps after inactivity
- Pro: $10/month for dedicated instance

---

## Option 4: VERCEL (Serverless)

### Why Vercel?
- Fast deployment
- Serverless functions
- Great uptime
- Easy integration with Next.js

### Setup:

#### 1 Create Vercel Account
- Sign up: https://vercel.com/
- Import GitHub repo

#### 2. Configure Function
- Create `api/send-email.js`:
```javascript
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  // Your email logic here
  // Reference: backend/server.js
}
```

#### 3. Set Environment Variables
From Vercel dashboard:
- Add SMTP_PASS, ADMIN_EMAIL, etc.

#### 4. Deploy
`git push` auto-triggers deployment

---

## Option 5: VPS (Full Control)

### Why VPS?
- Full control
- Best performance
- Unlimited resources
- More complex setup

### Popular VPS Providers:
- **DigitalOcean** ($4-6/month)
- **Linode** ($5-10/month)
- **AWS EC2** (free tier available)
- **Vultr** ($2.50+/month)

### Basic Setup for DigitalOcean:

#### 1. Create Droplet (VPS)
- Size: Basic ($5-6/month)
- OS: Ubuntu 22.04
- Region: Closest to your users

#### 2. SSH Into Server
```bash
ssh root@your-droplet-ip
```

#### 3. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 4. Upload Files
```bash
scp -r ./* root@your-droplet-ip:/var/www/ajk-email/
```

#### 5. Install Dependencies
```bash
cd /var/www/ajk-email
npm install --production
```

#### 6. Create .env File
```bash
sudo nano .env
```
Add SMTP credentials

#### 7. Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 start backend/server.js --name "ajk-email"
pm2 startup
pm2 save
```

#### 8. Setup Nginx Reverse Proxy
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

#### 9. Setup SSL (HTTPS)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

#### 10. Update Frontend URL
```javascript
return 'https://yourdomain.com';
```

---

## PRODUCTION CHECKLIST

Before going live, verify:

- [ ] `.env` has production credentials
- [ ] `NODE_ENV=production`
- [ ] `CORS` origins include your domain
- [ ] SMTP connection tested
- [ ] Rate limiting appropriate for expected traffic
- [ ] Logs being collected/monitored
- [ ] Auto-reply emails tested
- [ ] Admin emails tested
- [ ] HTTPS/SSL enabled
- [ ] Form tested on live site
- [ ] Honeypot field hidden on production
- [ ] Error handling working

---

## UPDATING FRONTEND

After deploying backend, update `app.js`:

```javascript
const getBackendURL = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  
  // Production: Use your deployed backend URL
  if (window.location.hostname === 'ajk-insurance.com') {
    return 'https://your-deployed-backend.com'; // Update this!
  }
  
  return 'https://your-deployed-backend.com'; // Default
};
```

---

## MONITORING IN PRODUCTION

### Track Email Delivery
```bash
# Heroku
heroku logs --tail

# Railway
# View in dashboard

# VPS
tail -f /var/log/app.log
```

### Check Status
- Heroku: `heroku status`
- Railway: Dashboard
- VPS: `pm2 status`

### Set Up Alerts
- Heroku: Integrate with PagerDuty
- Railway: Email notifications
- VPS: Use Uptime Robot (https://uptimerobot.com/)

---

## TROUBLESHOOTING DEPLOYMENT

### "Cannot find module 'express'"
→ Forgot `npm install` on server

### "SMTP Connection Error in Production"
→ Check environment variables set correctly on platform

### "Emails not sending"
→ Check `.env` has correct SMTP credentials
→ Verify rate limits not too strict

### "CORs Error"
→ Update CORS origins in `backend/server.js`
→ Add your production domain

### "502 Bad Gateway"
→ Backend crashed or not responding
→ Check logs for errors
→ Restart service

---

## COST COMPARISON

| Platform | Cost | Pros | Cons |
|----------|------|------|------|
| Heroku | $7/mo | Easy | Needs paid plan for reliability |
| Railway | $5/mo credit | Generous free tier | Pay-as-you-go |
| Render | Free | No payment needed | Sleeps on free |
| Vercel | Free | Fast | More complex setup |
| VPS | $5-10/mo | Full control | More maintenance |

---

## BEST CHOICE FOR YOUR USE CASE

- **Learning/Testing**: Use **Railway or Render** (free)
- **Small Business**: Use **Railway or Heroku** ($7-10/mo)
- **High Traffic**: Use **VPS or AWS** ($10+/mo)
- **Always-On Needed**: Use **Heroku Pro or VPS**

---

## RECOMMENDED: RAILWAY.APP

✅ Easiest intermediate option  
✅ $5 free credits  
✅ Pay-as-you-go  
✅ Excellent uptime  
✅ Auto-deploy from GitHub  

**Setup time**: ~5 minutes

---

## NEXT STEPS

1. Choose platform based on your needs
2. Follow deployment steps for your choice
3. Set environment variables
4. Test email forms on production
5. Update `app.js` with production URL
6. Monitor logs for issues

---

**Need help?** See SETUP_EMAIL.md for complete documentation

**Status**: Ready for production deployment ✓
