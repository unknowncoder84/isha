@echo off
echo ========================================
echo Testing Project Setup
echo ========================================
echo.

echo [1/5] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

echo [2/5] Checking pnpm...
pnpm --version
if %errorlevel% neq 0 (
    echo WARNING: pnpm is not installed!
    echo Installing pnpm...
    npm install -g pnpm
)
echo ✓ pnpm is ready
echo.

echo [3/5] Checking Python...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed!
    echo Please install from: https://www.python.org/
    pause
    exit /b 1
)
echo ✓ Python is installed
echo.

echo [4/5] Checking if ports are available...
netstat -ano | findstr :4008 > nul
if %errorlevel% equ 0 (
    echo WARNING: Port 4008 is already in use!
    echo Please close the application using this port.
) else (
    echo ✓ Port 4008 is available
)

netstat -ano | findstr :8000 > nul
if %errorlevel% equ 0 (
    echo WARNING: Port 8000 is already in use!
    echo Please close the application using this port.
) else (
    echo ✓ Port 8000 is available
)
echo.

echo [5/5] Checking project files...
if exist "package.json" (
    echo ✓ package.json found
) else (
    echo ERROR: package.json not found!
)

if exist "backend\main.py" (
    echo ✓ backend/main.py found
) else (
    echo ERROR: backend/main.py not found!
)

if exist ".env.local" (
    echo ✓ .env.local found
) else (
    echo WARNING: .env.local not found!
)
echo.

echo ========================================
echo Setup Check Complete!
echo ========================================
echo.
echo You can now run: start-dev.bat
echo.
pause
