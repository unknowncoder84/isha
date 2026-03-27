# ⚡ Quick Fix for Signup Error

## The Error
```
Database error saving new user
```

## ✅ Solution (2 Minutes)

### Step 1: Turn OFF Email Confirmation

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **"Authentication"** (left sidebar)
4. Click **"Providers"** tab
5. Click on **"Email"** provider
6. Find **"Confirm email"** toggle
7. **Turn it OFF** (should be gray/disabled)
8. Click **"Save"** at the bottom

### Step 2: Try Signup Again

1. Go to http://localhost:3030/auth/signup
2. Enter your details
3. Click "Create Account"
4. Should work now! ✅

## Why This Fixes It

When "Confirm email" is ON:
- Supabase sends confirmation email
- User must click link to confirm
- If email service not configured, it fails

When "Confirm email" is OFF:
- Users can signup immediately
- No email confirmation needed
- Perfect for testing

## ✅ Verify It Worked

1. After signup, you should be redirected to dashboard
2. Go to Supabase Dashboard → Authentication → Users
3. You should see your new user listed
4. Try logging out and logging in again

## 🔄 For Production

When you deploy to production:
1. Turn "Confirm email" back ON
2. Configure email service (SMTP)
3. Customize email templates
4. Test email confirmation flow

## 🐛 Still Having Issues?

If you still get errors after turning OFF "Confirm email":

### Check Browser Console
1. Press F12 to open DevTools
2. Go to Console tab
3. Try signing up again
4. Look for red error messages
5. Share the error message

### Check Supabase Logs
1. Go to Supabase Dashboard
2. Click "Logs" in left sidebar
3. Look for recent errors
4. Check what went wrong

### Run SQL Fix
Go to Supabase SQL Editor and run:

```sql
-- Make sure profiles table exists
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'Patient',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow inserts
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.profiles;
CREATE POLICY "Allow insert for authenticated users" ON public.profiles
    FOR INSERT WITH CHECK (true);

-- Allow users to view own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
```

---

**TL;DR**: Turn OFF "Confirm email" in Supabase → Try signup again → Should work! ✅
