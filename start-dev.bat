@echo off
echo ========================================
echo Starting Diabetes Management System
echo ========================================
echo.
echo Frontend will run on: http://localhost:4008
echo Backend API will run on: http://localhost:8000
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call pnpm install
    echo.
)

REM Check if Python virtual environment exists
if not exist "backend\venv\" (
    echo Creating Python virtual environment...
    cd backend
    python -m venv venv
    cd ..
    echo.
)

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..
echo.

echo Starting services...
echo.

REM Start backend in a new window
start "Backend API (Port 8000)" cmd /k "cd backend && venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend
echo Starting frontend on port 4008...
call pnpm dev

pause
