# 📧 Email Login Setup Guide

## Overview
Your app already has email login functionality! Any user can sign up with their email and password, and their account will be stored in Supabase authentication system.

## ✅ What's Already Working

### Current Setup
1. **Sign Up**: Users can create accounts with email/password
2. **Login**: Users can log in with their credentials
3. **User Storage**: Currently using localStorage (demo mode)
4. **Session Management**: Automatic session handling

## 🔄 Upgrade to Supabase Authentication

To enable full Supabase authentication with user IDs stored in the database, follow these steps:

### Step 1: Configure Supabase Email Settings

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ccpmyfhgzayjkjmcbwwq`
3. Navigate to **Authentication** → **Settings**
4. Configure Email Settings:

#### Email Auth Settings
```
✅ Enable Email Provider
✅ Enable Email Confirmations (optional - disable for easier testing)
✅ Enable Email Change Confirmations
```

#### Site URL Configuration
```
Site URL: http://localhost:3030
Redirect URLs: 
  - http://localhost:3030/**
  - http://localhost:3030/dashboard
  - http://localhost:3030/auth/callback
```

#### Email Templates (Optional)
You can customize:
- Confirmation email
- Password reset email
- Magic link email

### Step 2: Update App Context to Use Supabase

The app context needs to be updated to use Supabase instead of localStorage. Here's what needs to change:

#### Current Flow (localStorage):
```
User signs up → Stored in localStorage → Manual session management
```

#### New Flow (Supabase):
```
User signs up → Supabase Auth → Auto profile creation → Session managed by Supabase
```

### Step 3: Enable Email Confirmation (Optional)

#### Option A: Disable Email Confirmation (Easier for Testing)
1. Go to Supabase Dashboard → Authentication → Settings
2. Find "Enable email confirmations"
3. **Disable** it
4. Users can login immediately after signup

#### Option B: Enable Email Confirmation (Production)
1. Keep "Enable email confirmations" ON
2. Configure email templates
3. Users must verify email before login
4. More secure for production

### Step 4: Test the Authentication Flow

#### Test Sign Up
1. Go to http://localhost:3030/auth/signup
2. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!
3. Click "Create Account"
4. Should redirect to dashboard

#### Test Login
1. Go to http://localhost:3030/auth/login
2. Enter same credentials
3. Click "Sign In"
4. Should redirect to dashboard

#### Verify in Supabase
1. Go to Supabase Dashboard → Authentication → Users
2. You should see your test user listed
3. Note the User ID (UUID format)

### Step 5: Check User Data Storage

#### In Supabase Auth Table
```sql
-- View all authenticated users
SELECT * FROM auth.users;
```

#### In Profiles Table
```sql
-- View user profiles
SELECT * FROM public.profiles;
```

The `profiles` table should automatically create an entry when a user signs up (via the trigger we set up in the SQL schema).

## 🔐 How Authentication Works

### Sign Up Flow
```
1. User fills signup form
2. Supabase creates auth.users entry
3. Trigger creates public.profiles entry
4. User ID (UUID) is generated
5. Session token created
6. User redirected to dashboard
```

### Login Flow
```
1. User enters email/password
2. Supabase verifies credentials
3. Session token generated
4. User data loaded from profiles
5. User redirected to dashboard
```

### Session Management
```
- Sessions stored in browser cookies
- Auto-refresh on page reload
- Expires after inactivity
- Logout clears session
```

## 📊 User Data Structure

### auth.users (Supabase Auth)
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "created_at": "2026-03-28T...",
  "confirmed_at": "2026-03-28T...",
  "last_sign_in_at": "2026-03-28T...",
  "raw_user_meta_data": {
    "full_name": "Test User",
    "role": "Patient"
  }
}
```

### public.profiles (Your App)
```json
{
  "id": "uuid-here",  // Same as auth.users.id
  "full_name": "Test User",
  "email": "user@example.com",
  "role": "Patient",
  "created_at": "2026-03-28T...",
  "updated_at": "2026-03-28T..."
}
```

## 🎯 Current vs Supabase Auth

### Current (localStorage)
✅ Works immediately
✅ No email required
✅ Good for testing
❌ Not persistent across devices
❌ No real user IDs
❌ Not production-ready

### Supabase Auth
✅ Real user IDs (UUID)
✅ Persistent across devices
✅ Secure session management
✅ Production-ready
✅ Email verification
✅ Password reset
✅ OAuth providers (Google, etc.)
❌ Requires email configuration

## 🚀 Quick Start (Current Setup)

Your app is already configured! Just use it:

### For Testing (Current Setup)
1. Go to http://localhost:3030/auth/signup
2. Enter ANY email and password
3. Click "Create Account"
4. You're logged in!

### User ID Storage
- Currently: Stored in localStorage
- User ID: Email address (temporary)
- Session: Browser-based

## 🔧 Upgrade to Full Supabase Auth

If you want to upgrade to full Supabase authentication:

### 1. Update lib/app-context.tsx

Replace the `login` and `signup` functions with Supabase calls:

```typescript
import { supabase } from "@/lib/supabase"

const signup = async (name: string, email: string, password: string, role: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        role: role,
      },
    },
  })
  
  if (error) throw error
  
  setIsAuthenticated(true)
  setUser({ name, email })
  return true
}

const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  
  setIsAuthenticated(true)
  setUser({ 
    name: data.user?.user_metadata?.full_name || email.split('@')[0], 
    email 
  })
  return true
}
```

### 2. Add Session Listener

```typescript
useEffect(() => {
  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (session?.user) {
        setIsAuthenticated(true)
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
        })
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    }
  )

  return () => {
    subscription.unsubscribe()
  }
}, [])
```

### 3. Update Logout

```typescript
const logout = async () => {
  await supabase.auth.signOut()
  setIsAuthenticated(false)
  setUser(null)
  setScanResult(null)
}
```

## 📝 Testing Checklist

### Current Setup (localStorage)
- [ ] Sign up with any email
- [ ] Login with same credentials
- [ ] Access dashboard
- [ ] Logout and login again
- [ ] Data persists in browser

### Supabase Auth (After Upgrade)
- [ ] Sign up creates user in Supabase
- [ ] User appears in Authentication → Users
- [ ] Profile created in profiles table
- [ ] Login works with Supabase credentials
- [ ] Session persists on page refresh
- [ ] Logout clears Supabase session
- [ ] Can't access dashboard when logged out

## 🐛 Troubleshooting

### Issue: "User already exists"
**Solution**: User is already in Supabase. Try logging in instead.

### Issue: "Invalid login credentials"
**Solution**: Check email/password. Passwords are case-sensitive.

### Issue: "Email not confirmed"
**Solution**: 
1. Check email for confirmation link, OR
2. Disable email confirmation in Supabase settings

### Issue: "Can't receive emails"
**Solution**: 
1. Check spam folder
2. Use a real email address
3. Configure SMTP in Supabase (optional)
4. Disable email confirmation for testing

### Issue: "Session expired"
**Solution**: Login again. Sessions expire after inactivity.

## 🎓 Best Practices

### For Development
1. Disable email confirmation
2. Use test emails (test@example.com)
3. Clear browser data between tests
4. Check Supabase logs for errors

### For Production
1. Enable email confirmation
2. Configure custom email templates
3. Set up custom SMTP (optional)
4. Enable password requirements
5. Add rate limiting
6. Enable 2FA (future)

## 📞 Support

### Check These First
1. Supabase Dashboard → Authentication → Users
2. Browser console for errors
3. Network tab for API calls
4. Supabase logs

### Common Solutions
- Clear browser cache
- Check Supabase URL in .env.local
- Verify Supabase keys are correct
- Ensure SQL schema was run

## ✅ Summary

### What You Have Now
- ✅ Email/password signup
- ✅ Email/password login
- ✅ Session management
- ✅ User data storage (localStorage)
- ✅ Works immediately

### What You Can Add
- ⏳ Supabase authentication
- ⏳ Real user IDs (UUID)
- ⏳ Email verification
- ⏳ Password reset
- ⏳ OAuth (Google, etc.)
- ⏳ Cross-device sync

### Your Choice
1. **Keep current setup**: Works great for testing and demos
2. **Upgrade to Supabase**: Better for production and real users

Both options work! Choose based on your needs.

---

**Your app is ready to use with email login! 🎉**

Users can sign up and login right now at http://localhost:3030
