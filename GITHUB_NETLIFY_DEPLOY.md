# 🚀 GitHub & Netlify Deployment Guide

Complete step-by-step guide to push your code to GitHub and deploy to Netlify.

---

## 📦 STEP 1: Push to GitHub

### 1.1 Initialize Git Repository
Open your terminal in the project root and run:

```bash
git init
```

### 1.2 Add All Files
```bash
git add .
```

### 1.3 Create First Commit
```bash
git commit -m "Initial commit: Diabetes Management System with patient and doctor portals"
```

### 1.4 Set Main Branch
```bash
git branch -M main
```

### 1.5 Add Remote Repository
```bash
git remote add origin https://github.com/unknowncoder84/isha.git
```

### 1.6 Push to GitHub
```bash
git push -u origin main
```

**✅ Your code is now on GitHub!**

---

## 🌐 STEP 2: Deploy to Netlify

### 2.1 Create Netlify Account
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Sign up with GitHub (recommended) or email
3. Authorize Netlify to access your GitHub account

### 2.2 Import Your Project
1. Click **"Add new site"** button
2. Select **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify if prompted
5. Search for and select **"isha"** repository

### 2.3 Configure Build Settings
On the deploy configuration page, enter:

**Site name**: `isha-diabetes-app` (or your preferred name)

**Branch to deploy**: `main`

**Build command**: 
```
npm run build
```

**Publish directory**: 
```
.next
```

**Build settings** (should auto-detect Next.js):
- Framework: Next.js
- Node version: 20.x

### 2.4 Add Environment Variables
Click **"Add environment variables"** and add these:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.com` (or leave as localhost for now) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ccpmyfhgzayjkjmcbwwq.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key from `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key from `.env.local` |

**⚠️ Important**: Copy these values from your `.env.local` file!

### 2.5 Deploy!
1. Click **"Deploy site"** button
2. Wait 2-5 minutes for build to complete
3. You'll see "Site is live" when ready

**🎉 Your site is now live!**

---

## 🔧 STEP 3: Configure Supabase for Production

### 3.1 Get Your Netlify URL
After deployment, you'll get a URL like:
```
https://isha-diabetes-app.netlify.app
```

### 3.2 Update Supabase Settings
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Update these fields:

**Site URL**:
```
https://isha-diabetes-app.netlify.app
```

**Redirect URLs** (add these):
```
https://isha-diabetes-app.netlify.app/**
https://isha-diabetes-app.netlify.app/auth/callback
http://localhost:3030/**
```

5. Click **Save**

### 3.3 Disable Email Confirmation (Optional)
For easier testing:
1. Go to **Authentication** → **Providers** → **Email**
2. Uncheck **"Confirm email"**
3. Click **Save**

---

## ✅ STEP 4: Test Your Deployment

### 4.1 Test Patient Portal
1. Visit `https://your-site.netlify.app`
2. Click **"Sign Up"**
3. Create a new account
4. Login and test features:
   - Upload medical report
   - Chat with AI consultant
   - View dashboard
   - Check appointments

### 4.2 Test Doctor Portal
1. Visit `https://your-site.netlify.app/doctor/login`
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Test features:
   - Add patient
   - View dashboard
   - Schedule appointment
   - Check alerts

---

## 🔄 STEP 5: Future Updates

### To Deploy Updates:
```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push
```

Netlify will automatically rebuild and deploy! 🚀

---

## 🐛 Troubleshooting

### Build Failed on Netlify
**Check build logs** in Netlify dashboard:
- Look for missing dependencies
- Verify environment variables are set
- Check Node.js version compatibility

**Common fixes**:
```bash
# Clear cache and redeploy
# In Netlify: Site settings → Build & deploy → Clear cache and deploy site
```

### Authentication Not Working
1. Verify Supabase URL and keys in Netlify environment variables
2. Check Supabase redirect URLs include your Netlify domain
3. Check browser console for errors

### Real-time Updates Not Working
1. Verify Supabase Realtime is enabled
2. Check RLS policies in Supabase
3. Test in incognito mode (clear cache)

### 404 Errors on Page Refresh
This should be handled by `netlify.toml`, but if issues persist:
1. Check `netlify.toml` exists in root
2. Verify redirects configuration
3. Redeploy site

---

## 📊 Monitoring Your Site

### Netlify Dashboard
- **Analytics**: View site traffic and performance
- **Functions**: Monitor serverless function usage
- **Deploy logs**: Check build history and logs
- **Forms**: If you add forms later

### Supabase Dashboard
- **Database**: Monitor table usage
- **Authentication**: Track user signups
- **API**: Check API usage and performance
- **Logs**: View real-time logs

---

## 🎯 Next Steps

1. ✅ Custom domain (optional)
   - Go to Netlify → Domain settings
   - Add your custom domain
   - Update DNS records

2. ✅ Enable HTTPS (automatic on Netlify)

3. ✅ Set up monitoring
   - Add error tracking (Sentry)
   - Set up uptime monitoring

4. ✅ Backend deployment
   - Deploy FastAPI backend to Railway/Render
   - Update `NEXT_PUBLIC_API_URL` in Netlify

---

## 📞 Support

If you encounter issues:
1. Check Netlify build logs
2. Check browser console
3. Check Supabase logs
4. Review this guide again

---

**🎉 Congratulations! Your diabetes management system is now live!**

Share your site: `https://your-site.netlify.app`
