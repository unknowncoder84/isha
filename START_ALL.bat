@echo off
cls
echo ========================================
echo  Diabetes Management System Startup
echo ========================================
echo.
echo Stopping any existing services...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM python.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Clearing cache...
if exist ".next" rmdir /s /q ".next"
echo Cache cleared!

echo.
echo ========================================
echo  Starting Backend (Port 8000)
echo ========================================
cd backend
start "Backend API - Port 8000" cmd /k "python -m uvicorn main:app --reload --port 8000"
cd ..

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo  Starting Frontend (Port 4008)
echo ========================================
start "Frontend - Port 4008" cmd /k "pnpm dev"

echo.
echo ========================================
echo  Services Starting...
echo ========================================
echo.
echo Backend API: http://localhost:8000
echo Frontend:    http://localhost:4008
echo API Docs:    http://localhost:8000/docs
echo.
echo Waiting 10 seconds for services to initialize...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo  Opening Browser...
echo ========================================
start http://localhost:4008

echo.
echo ========================================
echo  ALL SERVICES STARTED!
echo ========================================
echo.
echo Frontend: http://localhost:4008
echo Backend:  http://localhost:8000
echo.
echo Press any key to exit this window...
echo (Services will continue running in separate windows)
pause >nul
