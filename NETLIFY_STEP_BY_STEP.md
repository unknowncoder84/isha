# 🌐 Netlify Deployment - Step by Step Guide

Your code is now on GitHub! Follow these exact steps to deploy to Netlify.

---

## ✅ STEP 1: Open Netlify

1. Open your web browser
2. Go to: **https://app.netlify.com**
3. If you don't have an account:
   - Click **"Sign up"**
   - Choose **"Sign up with GitHub"** (recommended)
   - Authorize Netlify to access your GitHub
4. If you have an account:
   - Click **"Log in"**
   - Log in with your credentials

---

## ✅ STEP 2: Import Your Project

1. Once logged in, you'll see your Netlify dashboard
2. Click the **"Add new site"** button (top right)
3. From the dropdown, select **"Import an existing project"**

![You'll see options like "Import from Git"]

4. Click **"Deploy with GitHub"**
5. If prompted, authorize Netlify to access your GitHub repositories
6. You'll see a list of your repositories

---

## ✅ STEP 3: Select Your Repository

1. In the search box, type: **isha**
2. Click on **"unknowncoder84/isha"** repository
3. You'll be taken to the deployment configuration page

---

## ✅ STEP 4: Configure Build Settings

On the configuration page, you'll see several fields. Fill them as follows:

### Site Name (Optional)
- You can leave it blank (Netlify will generate a random name)
- Or enter a custom name like: **isha-diabetes-app**
- This will be your URL: `https://isha-diabetes-app.netlify.app`

### Branch to Deploy
- Should already show: **main**
- Leave it as is

### Build Settings
You'll see these fields:

**Base directory:**
- Leave EMPTY (blank)

**Build command:**
```
npm run build
```

**Publish directory:**
```
.next
```

**Functions directory:**
- Leave EMPTY (blank)

---

## ✅ STEP 5: Add Environment Variables

This is VERY IMPORTANT! Your app won't work without these.

1. Look for **"Environment variables"** section
2. Click **"Add environment variables"** or **"New variable"**
3. Add these 4 variables ONE BY ONE:

### Variable 1:
- **Key:** `NEXT_PUBLIC_API_URL`
- **Value:** `http://localhost:8000`
- Click **"Add"** or **"Save"**

### Variable 2:
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://ccpmyfhgzayjkjmcbwwq.supabase.co`
- Click **"Add"** or **"Save"**

### Variable 3:
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcG15ZmhnemF5amtqbWNid3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTE3ODgsImV4cCI6MjA4ODM4Nzc4OH0.iqV8if9KV_mxxvFzOa__8ZzRLgqCbLIkD5xEffWlWv8`
- Click **"Add"** or **"Save"**

### Variable 4:
- **Key:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcG15ZmhnemF5amtqbWNid3dxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjgxMTc4OCwiZXhwIjoyMDg4Mzg3Nzg4fQ.X77gBF-ZtE_A7JRZCYAxt2IH4BD8croYQW8JwHS2RFc`
- Click **"Add"** or **"Save"**

**✅ You should now see all 4 environment variables listed**

---

## ✅ STEP 6: Deploy Your Site

1. Double-check all settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - 4 environment variables added
2. Click the big **"Deploy [site-name]"** button at the bottom
3. You'll be redirected to the deployment page

---

## ✅ STEP 7: Wait for Build to Complete

You'll see a build log with real-time updates:

1. **Building** - Installing dependencies and building your app
   - This takes 3-5 minutes
   - You'll see logs scrolling
2. **Publishing** - Uploading your site
3. **Published** - Your site is live! 🎉

**What to look for:**
- Green checkmarks ✓ mean success
- If you see errors, check the build log

---

## ✅ STEP 8: Get Your Site URL

Once deployment is complete:

1. You'll see **"Site is live"** message
2. Your site URL will be displayed at the top
3. It looks like: `https://[random-name].netlify.app`
   - Or: `https://isha-diabetes-app.netlify.app` (if you chose a custom name)
4. **COPY THIS URL** - you'll need it for the next step

---

## ✅ STEP 9: Update Supabase Configuration

Now you need to tell Supabase about your new production URL:

1. Open a new tab and go to: **https://supabase.com/dashboard**
2. Log in to your Supabase account
3. Click on your project (the one with URL: ccpmyfhgzayjkjmcbwwq)
4. In the left sidebar, click **"Authentication"**
5. Click **"URL Configuration"**
6. You'll see these fields:

### Site URL:
- Replace with your Netlify URL
- Example: `https://isha-diabetes-app.netlify.app`
- Remove any trailing slash

### Redirect URLs:
- Click **"Add URL"**
- Add: `https://isha-diabetes-app.netlify.app/**`
- Keep the existing localhost URLs for local development
- You should have:
  - `http://localhost:3030/**`
  - `https://isha-diabetes-app.netlify.app/**`

7. Scroll down and click **"Save"**

---

## ✅ STEP 10: Test Your Live Site!

1. Go to your Netlify URL
2. You should see your diabetes management app homepage

### Test Patient Portal:
1. Click **"Sign Up"** or **"Get Started"**
2. Create a new account with email/password
3. Log in
4. Test features:
   - ✓ Dashboard loads
   - ✓ Upload medical report
   - ✓ Chat with AI
   - ✓ View appointments

### Test Doctor Portal:
1. Go to: `https://your-site.netlify.app/doctor/login`
2. Login with:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Test features:
   - ✓ Dashboard loads with stats
   - ✓ Add patient
   - ✓ View patients list
   - ✓ Schedule appointment
   - ✓ Check alerts

---

## 🎉 SUCCESS! Your App is Live!

**Your URLs:**
- **Patient Portal:** `https://your-site.netlify.app`
- **Doctor Portal:** `https://your-site.netlify.app/doctor/login`
- **GitHub Repo:** https://github.com/unknowncoder84/isha

---

## 🔄 Making Updates in the Future

When you want to update your site:

1. Make changes to your code locally
2. Run these commands:
   ```bash
   git add .
   git commit -m "Description of your changes"
   git push
   ```
3. Netlify will automatically rebuild and deploy! 🚀
4. Wait 3-5 minutes for the new version to go live

---

## 🐛 Troubleshooting

### Build Failed
1. Check the build log in Netlify
2. Look for error messages (usually in red)
3. Common issues:
   - Missing environment variables
   - Syntax errors in code
   - Missing dependencies

**Fix:** 
- Go to Site Settings → Environment Variables
- Verify all 4 variables are there
- Redeploy: Deploys → Trigger deploy → Deploy site

### Site Loads but Features Don't Work
1. Open browser console (F12)
2. Look for errors
3. Common issues:
   - Supabase redirect URLs not updated
   - Environment variables incorrect

**Fix:**
- Double-check Supabase URL configuration
- Verify environment variables in Netlify

### Authentication Not Working
1. Check Supabase redirect URLs
2. Make sure you added your Netlify URL
3. Format: `https://your-site.netlify.app/**`

**Fix:**
- Go to Supabase → Authentication → URL Configuration
- Add your Netlify URL
- Save and try again

---

## 📞 Need Help?

- **Netlify Docs:** https://docs.netlify.com
- **Supabase Docs:** https://supabase.com/docs
- **Build Logs:** Check in Netlify dashboard under "Deploys"

---

## ✅ Deployment Checklist

- [x] Code pushed to GitHub
- [ ] Netlify account created
- [ ] Project imported from GitHub
- [ ] Build settings configured
- [ ] 4 environment variables added
- [ ] Site deployed successfully
- [ ] Netlify URL copied
- [ ] Supabase redirect URLs updated
- [ ] Patient portal tested
- [ ] Doctor portal tested

---

**🎉 Congratulations! Your diabetes management system is now live and accessible worldwide!**

**Share your site:** `https://your-site.netlify.app`
