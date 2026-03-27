# GlucoVision AI Backend

FastAPI backend for the Diabetes Management System with AI-powered predictions and medical document processing.

## Features

- PDF medical report scanning and data extraction (PyMuPDF)
- AI-powered diabetes risk prediction (LSTM/CNN models)
- Real-time sensor data management (MongoDB)
- RESTful API with automatic documentation

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

### 4. Run the Server

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Health Check
- `GET /` - Root endpoint
- `GET /health` - Health check

### PDF Processing
- `POST /api/pdf/scan` - Upload and scan medical PDF
- `GET /api/pdf/test` - Test PDF parser

### AI Predictions
- `POST /api/ai/predict` - Predict diabetes risk
- `GET /api/ai/model-info` - Get model information
- `GET /api/ai/test` - Test AI model

### Sensor Data
- `GET /api/sensors/readings/{user_id}` - Get user readings
- `POST /api/sensors/readings/{user_id}` - Add new reading
- `GET /api/sensors/test` - Test sensor service

## Project Structure

```
backend/
├── main.py              # FastAPI application entry point
├── routes/              # API route handlers
│   ├── pdf_parser.py    # PDF scanning endpoints
│   ├── ai_model.py      # AI prediction endpoints
│   └── sensor_data.py   # Sensor data endpoints
├── models/              # Trained ML models (.h5, .pth)
├── requirements.txt     # Python dependencies
└── .env                 # Environment variables
```

## Adding ML Models

Place your trained models in the `models/` directory:

```
models/
├── glucovision_lstm_v3.h5
└── glucovision_cnn_v2.pth
```

Update `routes/ai_model.py` to load your models.

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (Next.js default)
- `http://localhost:5173` (Vite default)

Update `main.py` to add additional origins if needed.
