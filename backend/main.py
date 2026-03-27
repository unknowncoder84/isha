from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Diabetes Management System API", version="1.0.0")

# CORS configuration for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:4008", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class HealthData(BaseModel):
    glucose: float
    bmi: float
    heart_rate: Optional[int] = None
    blood_pressure: Optional[str] = None

class PredictionResponse(BaseModel):
    risk_level: str
    confidence: float
    recommendation: str

@app.get("/")
async def root():
    return {"message": "Diabetes Management System API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Import route handlers
from routes import pdf_parser, ai_model, sensor_data

app.include_router(pdf_parser.router, prefix="/api/pdf", tags=["PDF Processing"])
app.include_router(ai_model.router, prefix="/api/ai", tags=["AI Predictions"])
app.include_router(sensor_data.router, prefix="/api/sensors", tags=["Sensor Data"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
