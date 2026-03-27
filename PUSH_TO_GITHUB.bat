@echo off
echo ========================================
echo   Pushing to GitHub Repository
echo ========================================
echo.

REM Initialize git if not already done
if not exist .git (
    echo Initializing Git repository...
    git init
    echo.
)

REM Add all files
echo Adding all files...
git add .
echo.

REM Commit with message
echo Committing changes...
git commit -m "GlucoVision Health App - Production Ready"
echo.

REM Set main branch
echo Setting main branch...
git branch -M main
echo.

REM Add remote origin (if not already added)
git remote remove origin 2>nul
echo Adding remote origin...
git remote add origin https://github.com/unknowncoder84/dibeties.git
echo.

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main --force
echo.

echo ========================================
echo   Push Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Go to https://app.netlify.com
echo 2. Click "Add new site" - "Import from GitHub"
echo 3. Select "unknowncoder84/dibeties"
echo 4. Build command: npm run build
echo 5. Publish directory: .next
echo 6. Click "Deploy site"
echo.
echo Your app will be live in 2-3 minutes!
echo.
pause
