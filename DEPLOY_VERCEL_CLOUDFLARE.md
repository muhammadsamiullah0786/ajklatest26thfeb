# 🚀 Deploy to Vercel with Cloudflare Domain

## Complete Setup Guide

---

## PART 1: Deploy to Vercel (5 minutes)

### Option A: Deploy via Vercel CLI (Fastest)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```
Enter your email - you'll receive a verification email.

#### Step 3: Deploy
```bash
cd c:\Users\Sami\AJK
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → ajk-insurance (or your choice)
- **Directory?** → ./
- **Override settings?** → No

#### Step 4: Deploy to Production
```bash
vercel --prod
```

✅ You'll get a URL like: `https://ajk-insurance.vercel.app`

---

### Option B: Deploy via Vercel Dashboard (Easiest)

#### Step 1: Push to GitHub
If your code isn't on GitHub yet:
```bash
cd c:\Users\Sami\AJK
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

Create a new repository on GitHub, then:
```bash
git remote add origin https://github.com/yourusername/ajk-insurance.git
git push -u origin main
```

#### Step 2: Import to Vercel
1. Go to https://vercel.com/
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repo
5. Click **"Import"**

**Configure:**
- **Framework Preset:** Other (Static Site)
- **Root Directory:** ./
- **Build Command:** Leave empty
- **Output Directory:** ./

6. Click **"Deploy"**

✅ Wait 1-2 minutes - you'll get a Vercel URL!

---

## PART 2: Connect Cloudflare Domain (5 minutes)

### Step 1: Get Your Vercel Deployment URL
After deployment, you'll have a URL like:
```
https://ajk-insurance.vercel.app
```

Copy your project name (e.g., `ajk-insurance`)

---

### Step 2: Add Domain in Vercel

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Domains"**
3. Enter your domain: `ajk-insurance.com`
4. Click **"Add"**

Vercel will show you DNS records needed. Keep this page open!

---

### Step 3: Configure DNS in Cloudflare

#### Go to Cloudflare Dashboard
1. Login to https://dash.cloudflare.com/
2. Select your domain: `ajk-insurance.com`
3. Go to **"DNS"** tab

#### Add DNS Records

Vercel will ask you to add either:

**OPTION A: Using A Records (Recommended)**

Delete any existing A records for `@` and `www`, then add:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| A | @ | 76.76.21.21 | DNS only (gray cloud) |
| CNAME | www | cname.vercel-dns.com | DNS only (gray cloud) |

**OPTION B: Using CNAME (Alternative)**

Delete any existing records for `@` and `www`, then:

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| CNAME | @ | cname.vercel-dns.com | DNS only (gray cloud) |
| CNAME | www | cname.vercel-dns.com | DNS only (gray cloud) |

⚠️ **IMPORTANT:** Set Proxy Status to **DNS only** (gray cloud icon) - NOT proxied!

---

### Step 4: Verify Domain

Back in Vercel:
1. Click **"Verify"** or **"Refresh"**
2. Wait 30-60 seconds for DNS propagation
3. Vercel will automatically verify and configure SSL

✅ Your site will be live at: `https://ajk-insurance.com`

---

## PART 3: Configure Cloudflare Settings

### SSL/TLS Settings
1. In Cloudflare, go to **SSL/TLS**
2. Set mode to: **Full (strict)**

### Enable Cloudflare Proxy (Optional)
After domain is verified in Vercel:
1. Go back to Cloudflare DNS
2. Click the cloud icon to turn proxy **ON** (orange cloud)
3. This enables Cloudflare CDN and DDoS protection

---

## PART 4: Test Your Deployment

### Check These:

- [ ] **Main domain works:** https://ajk-insurance.com
- [ ] **WWW redirect works:** https://www.ajk-insurance.com
- [ ] **HTTPS is enabled** (green padlock in browser)
- [ ] **All images load** (check assets folder)
- [ ] **EmailJS form works** (submit test form)
- [ ] **Mobile menu works**
- [ ] **All links work**

---

## Environment Variables (If Needed)

If you want to use .env variables on Vercel:

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add variables:
   - `EMAILJS_SERVICE_ID` = service_l35eaus
   - `EMAILJS_TEMPLATE_ID` = template_bcfbrbg
   - `EMAILJS_PUBLIC_KEY` = PYcH71DH2oAKBx8OP

Note: For frontend-only sites, these aren't needed since EmailJS is configured in the code.

---

## Automatic Deployments

Once connected to GitHub:
- **Every push to main** → Auto-deploys to production
- **Pull requests** → Create preview deployments
- **Rollback anytime** from Vercel dashboard

---

## Custom Domain Checklist

- [ ] Domain added in Vercel
- [ ] DNS records added in Cloudflare
- [ ] Set to "DNS only" (gray cloud) initially
- [ ] Domain verified in Vercel
- [ ] SSL certificate issued (automatic)
- [ ] Test https://ajk-insurance.com works
- [ ] Test https://www.ajk-insurance.com redirects
- [ ] Optional: Enable Cloudflare proxy (orange cloud)

---

## Troubleshooting

### "Domain is not verified"
- Wait 5-10 minutes for DNS propagation
- Check DNS records are exact (no typos)
- Make sure proxy is OFF (gray cloud) in Cloudflare

### "SSL Certificate Error"
- Wait a few minutes - Vercel auto-issues SSL
- Make sure DNS is pointing to Vercel
- Try clearing browser cache

### "Too Many Redirects"
- In Cloudflare SSL/TLS, change to "Full (strict)"
- Turn OFF Cloudflare proxy temporarily

### "Images not loading"
- Check all image paths start with `assets/`
- Make sure assets folder is committed to Git
- Check file extensions match exactly (.jpg vs .jpeg)

### "Form not working"
- EmailJS works from any domain automatically
- Check browser console (F12) for errors
- Test with `test-emailjs.html` file

---

## Vercel CLI Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment logs
vercel logs

# List all deployments
vercel ls

# Remove a deployment
vercel rm [deployment-url]

# Pull environment variables
vercel env pull
```

---

## Quick Reference

### Your URLs After Setup
- **Vercel URL:** https://ajk-insurance.vercel.app
- **Custom Domain:** https://ajk-insurance.com
- **WWW redirect:** https://www.ajk-insurance.com

### Cloudflare DNS Records
```
A     @      76.76.21.21              DNS only
CNAME www    cname.vercel-dns.com    DNS only
```

### Contact Support
- **Vercel:** https://vercel.com/support
- **Cloudflare:** https://dash.cloudflare.com/?to=/:account/support

---

## Performance Tips

After deployment:

1. **Enable Cloudflare Proxy** (orange cloud)
   - Adds CDN caching
   - DDoS protection
   - Analytics

2. **Compress Images**
   - Use tools like TinyPNG
   - Convert to WebP format

3. **Cloudflare Page Rules**
   - Cache everything
   - Always use HTTPS

---

## Next Steps

1. ✅ Deploy to Vercel using Option A or B above
2. ✅ Add domain in Vercel settings
3. ✅ Configure DNS in Cloudflare
4. ✅ Wait for SSL certificate (automatic)
5. ✅ Test website thoroughly
6. ✅ Enable Cloudflare proxy for better performance

---

**Ready to deploy?** Start with PART 1 above! 🚀

**Questions?** Check the Troubleshooting section.

**Status:** Ready for production deployment ✓
