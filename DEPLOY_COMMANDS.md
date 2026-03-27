# 🚀 Quick Deploy Commands

Copy and paste these commands in order to deploy your project.

---

## 📦 Push to GitHub

Run these commands in your terminal (in project root):

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Diabetes Management System"

# Set main branch
git branch -M main

# Add remote repository
git remote add origin https://github.com/unknowncoder84/isha.git

# Push to GitHub
git push -u origin main
```

**✅ Done! Your code is now on GitHub.**

---

## 🌐 Deploy to Netlify

### Option 1: Netlify CLI (Fastest)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Choose your team
# - Site name: isha-diabetes-app
# - Build command: npm run build
# - Publish directory: .next

# Deploy
netlify deploy --prod
```

### Option 2: Netlify Dashboard (Recommended)

1. Go to: https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub → Select "isha" repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variables (see below)
6. Click "Deploy site"

---

## 🔑 Environment Variables for Netlify

Add these in Netlify Dashboard → Site settings → Environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://ccpmyfhgzayjkjmcbwwq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcG15ZmhnemF5amtqbWNid3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTE3ODgsImV4cCI6MjA4ODM4Nzc4OH0.iqV8if9KV_mxxvFzOa__8ZzRLgqCbLIkD5xEffWlWv8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcG15ZmhnemF5amtqbWNid3dxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjgxMTc4OCwiZXhwIjoyMDg4Mzg3Nzg4fQ.X77gBF-ZtE_A7JRZCYAxt2IH4BD8croYQW8JwHS2RFc
```

---

## 🔄 Update Supabase After Deployment

After your site is live, update Supabase:

1. Get your Netlify URL (e.g., `https://isha-diabetes-app.netlify.app`)
2. Go to Supabase Dashboard → Authentication → URL Configuration
3. Update:
   - **Site URL**: `https://isha-diabetes-app.netlify.app`
   - **Redirect URLs**: Add `https://isha-diabetes-app.netlify.app/**`

---

## 🔄 Future Updates

To deploy updates after making changes:

```bash
# Stage changes
git add .

# Commit with message
git commit -m "Your update message"

# Push to GitHub (Netlify auto-deploys)
git push
```

---

## 🧪 Test Your Deployment

### Patient Portal
```
https://your-site.netlify.app
```
- Sign up with email/password
- Test dashboard features

### Doctor Portal
```
https://your-site.netlify.app/doctor/login
```
- Username: `admin`
- Password: `admin123`

---

## 📋 Checklist

- [ ] Code pushed to GitHub
- [ ] Site deployed on Netlify
- [ ] Environment variables added
- [ ] Supabase redirect URLs updated
- [ ] Patient portal tested
- [ ] Doctor portal tested
- [ ] Real-time updates working

---

**🎉 You're all set! Your app is live!**
