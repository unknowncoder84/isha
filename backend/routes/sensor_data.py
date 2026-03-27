from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import random

router = APIRouter()

class SensorReading(BaseModel):
    timestamp: str
    glucose: float
    heart_rate: Optional[int] = None
    temperature: Optional[float] = None

class SensorDataResponse(BaseModel):
    user_id: str
    readings: List[SensorReading]
    count: int

# Mock data generator for demonstration
def generate_mock_glucose_data(days: int = 7) -> List[SensorReading]:
    """Generate mock glucose readings for the last N days"""
    readings = []
    base_glucose = 110
    
    for i in range(days * 4):  # 4 readings per day
        timestamp = datetime.now() - timedelta(hours=i * 6)
        glucose = base_glucose + random.uniform(-20, 30)
        heart_rate = random.randint(65, 85)
        
        readings.append(SensorReading(
            timestamp=timestamp.isoformat(),
            glucose=round(glucose, 1),
            heart_rate=heart_rate,
            temperature=round(36.5 + random.uniform(-0.5, 0.5), 1)
        ))
    
    return sorted(readings, key=lambda x: x.timestamp)

@router.get("/readings/{user_id}", response_model=SensorDataResponse)
async def get_sensor_readings(user_id: str, days: int = 7):
    """Get sensor readings for a user"""
    try:
        readings = generate_mock_glucose_data(days)
        
        return SensorDataResponse(
            user_id=user_id,
            readings=readings,
            count=len(readings)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sensor data: {str(e)}")

@router.post("/readings/{user_id}")
async def add_sensor_reading(user_id: str, reading: SensorReading):
    """Add a new sensor reading"""
    # In production, this would save to MongoDB
    return {
        "success": True,
        "message": "Reading saved successfully",
        "user_id": user_id,
        "reading": reading
    }

@router.get("/test")
async def test_sensor_data():
    """Test endpoint for sensor data"""
    sample_readings = generate_mock_glucose_data(2)
    return {
        "status": "Sensor data service is ready",
        "sample_readings": sample_readings[:3]
    }
