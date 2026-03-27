@echo off
echo ============================================
echo GlucoVision - Supabase Setup Script
echo ============================================
echo.

echo Step 1: Copying environment file...
if exist .env.local.supabase (
    copy .env.local.supabase .env.local
    echo ✓ Environment file copied to .env.local
) else (
    echo ✗ Error: .env.local.supabase not found
    pause
    exit /b 1
)
echo.

echo Step 2: Installing Supabase package...
call npm install @supabase/supabase-js
if %errorlevel% neq 0 (
    echo ✗ Error installing package
    pause
    exit /b 1
)
echo ✓ Supabase package installed
echo.

echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo IMPORTANT: Next Steps
echo.
echo 1. Open .env.local file
echo 2. Replace [YOUR-PASSWORD] with your Supabase database password
echo 3. Go to https://supabase.com/dashboard
echo 4. Open SQL Editor
echo 5. Copy and run SUPABASE_SETUP.sql
echo 6. Run: npm run dev
echo.
echo ============================================
pause
