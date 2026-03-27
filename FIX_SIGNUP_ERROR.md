# 🔧 Fix Signup Error - Quick Solution

## The Problem

You're seeing: **"Database error saving new user"**

This happens because:
1. Email confirmation is enabled in Supabase
2. The profile creation trigger might not be set up
3. RLS policies might be blocking the insert

## ✅ Quick Fix (5 Minutes)

### Step 1: Disable Email Confirmation (Easiest)

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ccpmyfhgzayjkjmcbwwq`
3. Click "Authentication" → "Providers"
4. Click on "Email" provider
5. **Turn OFF "Confirm email"**
6. Click "Save"

### Step 2: Run This SQL

Go to Supabase SQL Editor and run:

```sql
-- Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- If it doesn't exist, create it
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'Patient')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Step 3: Fix RLS Policies

Run this in Supabase SQL Editor:

```sql
-- Allow users to insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow service role to insert profiles (for trigger)
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
CREATE POLICY "Service role can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (true);
```

### Step 4: Test Signup

1. Go to http://localhost:3030/auth/signup
2. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!
3. Click "Create Account"
4. Should work now! ✅

## 🔍 Alternative: Check What's Wrong

### Check if profiles table exists:
```sql
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'profiles';
```

### Check RLS policies:
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'profiles';
```

### Check if trigger exists:
```sql
SELECT * FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
```

## 🎯 Recommended Solution

**Option 1: Disable Email Confirmation (Easiest)**
- Turn OFF "Confirm email" in Supabase
- Users can signup immediately
- Good for testing

**Option 2: Keep Email Confirmation**
- Keep "Confirm email" ON
- Users must verify email
- Better for production
- But need to configure email service

## 📝 After Fixing

Once you've done Step 1 (disable email confirmation):

1. Try signing up again
2. Should work without errors
3. Check Supabase → Authentication → Users
4. You should see your new user!

## 🐛 Still Not Working?

If you still get errors, check browser console:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try signing up again
4. Look for error messages
5. Share the error with me

## ✅ Success Checklist

- [ ] Disabled "Confirm email" in Supabase
- [ ] Ran SQL to create trigger
- [ ] Ran SQL to fix RLS policies
- [ ] Tested signup
- [ ] User appears in Supabase Dashboard
- [ ] Can login successfully

---

**Quick Fix**: Just disable "Confirm email" in Supabase and try again!
