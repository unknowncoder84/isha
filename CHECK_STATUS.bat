@echo off
cls
echo ========================================
echo  Service Status Check
echo ========================================
echo.

echo [1/4] Checking if Backend is running on port 8000...
netstat -ano | findstr :8000 >nul
if %errorlevel% equ 0 (
    echo [OK] Backend is running on port 8000
    curl.exe -s http://localhost:8000/health
    echo.
) else (
    echo [ERROR] Backend is NOT running on port 8000
)

echo.
echo [2/4] Checking if Frontend is running on port 4008...
netstat -ano | findstr :4008 >nul
if %errorlevel% equ 0 (
    echo [OK] Frontend is running on port 4008
) else (
    echo [ERROR] Frontend is NOT running on port 4008
)

echo.
echo [3/4] Testing Backend API...
curl.exe -s http://localhost:8000/api/pdf/test
echo.

echo.
echo [4/4] Access URLs:
echo.
echo Frontend:  http://localhost:4008
echo Backend:   http://localhost:8000
echo API Docs:  http://localhost:8000/docs
echo.

echo ========================================
echo  Status Check Complete
echo ========================================
echo.
pause
