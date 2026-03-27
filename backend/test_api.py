"""
Test script for GlucoVision AI Backend API
Run this after starting the backend server to verify all endpoints
"""

import requests
import json
from pathlib import Path

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health check endpoint"""
    print("\n🔍 Testing Health Check...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200
    print("✅ Health check passed!")

def test_ai_prediction():
    """Test AI prediction endpoint"""
    print("\n🧠 Testing AI Prediction...")
    data = {
        "glucose": 128.5,
        "bmi": 25.3,
        "heart_rate": 78,
        "age": 35,
        "blood_pressure_systolic": 128
    }
    response = requests.post(f"{BASE_URL}/api/ai/predict", json=data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Risk Level: {result['risk_level']}")
    print(f"Confidence: {result['confidence']}")
    print(f"Recommendation: {result['recommendation']}")
    assert response.status_code == 200
    print("✅ AI prediction passed!")

def test_sensor_data():
    """Test sensor data endpoint"""
    print("\n📊 Testing Sensor Data...")
    response = requests.get(f"{BASE_URL}/api/sensors/readings/test-user?days=7")
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"User ID: {result['user_id']}")
    print(f"Readings Count: {result['count']}")
    print(f"Sample Reading: {result['readings'][0]}")
    assert response.status_code == 200
    print("✅ Sensor data passed!")

def test_model_info():
    """Test model info endpoint"""
    print("\n📋 Testing Model Info...")
    response = requests.get(f"{BASE_URL}/api/ai/model-info")
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Model: {result['model_name']}")
    print(f"Accuracy: {result['accuracy']}")
    print(f"Status: {result['status']}")
    assert response.status_code == 200
    print("✅ Model info passed!")

def test_all_endpoints():
    """Test all API endpoints"""
    print("=" * 50)
    print("🚀 GlucoVision AI Backend API Tests")
    print("=" * 50)
    
    try:
        test_health()
        test_ai_prediction()
        test_sensor_data()
        test_model_info()
        
        print("\n" + "=" * 50)
        print("✅ All tests passed successfully!")
        print("=" * 50)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Cannot connect to backend server")
        print("Make sure the backend is running at http://localhost:8000")
        print("Run: cd backend && uvicorn main:app --reload")
        
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
        
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")

if __name__ == "__main__":
    test_all_endpoints()
