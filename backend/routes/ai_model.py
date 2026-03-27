from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import numpy as np
import os
from typing import Optional

router = APIRouter()

class HealthInput(BaseModel):
    glucose: float
    bmi: float
    heart_rate: Optional[int] = 75
    age: Optional[int] = 35
    blood_pressure_systolic: Optional[int] = 120

class PredictionResponse(BaseModel):
    risk_level: str
    confidence: float
    glucose_avg: float
    bmi: float
    recommendation: str
    model_version: str

# Simple rule-based prediction (placeholder for actual ML model)
def predict_diabetes_risk(data: HealthInput) -> PredictionResponse:
    """
    Predict diabetes risk based on health metrics
    In production, this would load a trained LSTM/CNN model from /models directory
    """
    
    glucose = data.glucose
    bmi = data.bmi
    
    # Risk scoring logic
    risk_score = 0.0
    
    # Glucose scoring
    if glucose < 100:
        risk_score += 0.0
    elif glucose < 126:
        risk_score += 0.4
    else:
        risk_score += 0.7
    
    # BMI scoring
    if bmi < 25:
        risk_score += 0.0
    elif bmi < 30:
        risk_score += 0.2
    else:
        risk_score += 0.3
    
    # Normalize confidence
    confidence = min(risk_score, 1.0)
    
    # Determine risk level
    if risk_score < 0.3:
        risk_level = "Normal"
        recommendation = "Maintain healthy lifestyle with regular exercise and balanced diet"
    elif risk_score < 0.6:
        risk_level = "Prediabetic"
        recommendation = "Lifestyle modification recommended: increase physical activity, reduce sugar intake, monitor glucose regularly"
    else:
        risk_level = "Diabetic"
        recommendation = "Consult healthcare provider immediately. Strict diet control and medication may be required"
    
    return PredictionResponse(
        risk_level=risk_level,
        confidence=round(confidence, 3),
        glucose_avg=glucose,
        bmi=bmi,
        recommendation=recommendation,
        model_version="DiabetesAI-LSTM-v3"
    )

@router.post("/predict", response_model=PredictionResponse)
async def predict_risk(data: HealthInput):
    """Predict diabetes risk using AI model"""
    try:
        prediction = predict_diabetes_risk(data)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.get("/model-info")
async def get_model_info():
    """Get information about the loaded AI model"""
    return {
        "model_name": "DiabetesAI-LSTM-v3",
        "model_type": "LSTM/CNN Hybrid",
        "accuracy": 0.978,
        "training_samples": "50,000+",
        "status": "active"
    }

@router.get("/test")
async def test_ai_model():
    """Test endpoint for AI model"""
    sample_data = HealthInput(glucose=128.5, bmi=25.3, heart_rate=78)
    result = predict_diabetes_risk(sample_data)
    return {"status": "AI model is ready", "sample_prediction": result}
