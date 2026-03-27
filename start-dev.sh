#!/bin/bash

echo "========================================"
echo "Starting Diabetes Management System"
echo "========================================"
echo ""
echo "Frontend will run on: http://localhost:4008"
echo "Backend API will run on: http://localhost:8000"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    pnpm install
    echo ""
fi

# Check if Python virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
    echo ""
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt
cd ..
echo ""

echo "Starting services..."
echo ""

# Start backend in background
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting frontend on port 4008..."
pnpm dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
