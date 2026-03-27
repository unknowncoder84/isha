# Netlify Deployment Guide

## Prerequisites
- GitHub account
- Netlify account (free tier works)
- Supabase project set up with the SQL schema

## Step 1: Prepare Your Repository

1. Make sure all your code is committed to Git
2. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Step 2: Configure Environment Variables

Before deploying, ensure these environment variables are set in Netlify:

### Required Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://ccpmyfhgzayjkjmcbwwq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcG15ZmhnemF5amtqbWNid3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTE3ODgsImV4cCI6MjA4ODM4Nzc4OH0.iqV8if9KV_mxxvFzOa__8ZzRLgqCbLIkD5xEffWlWv8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcG15ZmhnemF5amtqbWNid3dxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjgxMTc4OCwiZXhwIjoyMDg4Mzg3Nzg4fQ.X77gBF-ZtE_A7JRZCYAxt2IH4BD8croYQW8JwHS2RFc
NEXT_PUBLIC_API_URL=https://your-backend-url.com (or keep localhost for now)
```

## Step 3: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard

1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 20.11.0
5. Add environment variables (from Step 2)
6. Click "Deploy site"

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify in your project
netlify init

# Deploy
netlify deploy --prod
```

## Step 4: Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `SUPABASE_SETUP_IMPROVED.sql`
4. Run the script
5. Verify all tables are created in the Table Editor

## Step 5: Configure Supabase Auth

1. In Supabase Dashboard → Authentication → URL Configuration
2. Add your Netlify URL to:
   - **Site URL**: `https://your-app.netlify.app`
   - **Redirect URLs**: `https://your-app.netlify.app/**`

## Step 6: Test Your Deployment

1. Visit your Netlify URL
2. Try signing up for a new account
3. Test login functionality
4. Verify data persistence

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### Authentication Issues
- Verify Supabase URL and keys are correct
- Check Supabase Auth settings
- Ensure redirect URLs are configured

### Database Connection Issues
- Verify RLS policies are enabled
- Check that SQL schema was run successfully
- Test Supabase connection from local environment first

## Post-Deployment

### Custom Domain (Optional)
1. Go to Netlify Dashboard → Domain settings
2. Add your custom domain
3. Update Supabase redirect URLs with new domain

### Monitoring
- Enable Netlify Analytics
- Set up Supabase monitoring
- Configure error tracking (Sentry, etc.)

## Backend Deployment (Optional)

The FastAPI backend needs separate hosting. Options:
- **Railway**: Easy Python deployment
- **Render**: Free tier available
- **Heroku**: Simple deployment
- **AWS/GCP/Azure**: More control

Update `NEXT_PUBLIC_API_URL` environment variable with your backend URL.

## Support

For issues:
1. Check Netlify build logs
2. Review Supabase logs
3. Test locally first with `npm run dev:all`
