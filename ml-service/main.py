from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
from datetime import datetime
import os
from schemas import (
    AnomalyRequest,
    PredictRequest,
    AnomalyResponse,
    PredictResponse,
    HealthResponse
)

app = FastAPI(title="ElectroGyaan ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5000",
        "http://localhost:5173",
        "*"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
iso_model = None
lr_model = None


@app.on_event("startup")
async def load_models():
    global iso_model, lr_model
    try:
        iso_path = os.path.join(MODELS_DIR, "iso_model.pkl")
        lr_path = os.path.join(MODELS_DIR, "lr_model.pkl")
        
        iso_model = joblib.load(iso_path)
        lr_model = joblib.load(lr_path)
        
        print("✅ Models loaded successfully")
        print(f"   - IsolationForest: {iso_path}")
        print(f"   - LinearRegression: {lr_path}")
    except Exception as e:
        print(f"⚠️  Model loading failed: {e}")
        print(f"   Models directory: {MODELS_DIR}")


def get_cyclical_features(timestamp_str):
    """
    Parse ISO 8601 timestamp and extract cyclical time features.
    Returns: (hour_sin, hour_cos, day_sin, day_cos)
    """
    dt = None
    formats = [
        "%Y-%m-%dT%H:%M:%S.%fZ",
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M:%S.%f"
    ]
    
    for fmt in formats:
        try:
            dt = datetime.strptime(timestamp_str, fmt)
            break
        except ValueError:
            continue
    
    if dt is None:
        try:
            dt = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
        except Exception:
            raise ValueError(f"Unable to parse timestamp: {timestamp_str}")
    
    hour = dt.hour
    day_of_week = dt.weekday()
    
    hour_sin = np.sin(2 * np.pi * hour / 24)
    hour_cos = np.cos(2 * np.pi * hour / 24)
    day_sin = np.sin(2 * np.pi * day_of_week / 7)
    day_cos = np.cos(2 * np.pi * day_of_week / 7)
    
    return hour_sin, hour_cos, day_sin, day_cos


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint to verify service and model status."""
    return HealthResponse(
        status="ok" if (iso_model is not None and lr_model is not None) else "degraded",
        models_loaded=(iso_model is not None and lr_model is not None),
        iso_model=(iso_model is not None),
        lr_model=(lr_model is not None)
    )


@app.post("/api/ml/anomaly", response_model=AnomalyResponse)
async def detect_anomaly(request: AnomalyRequest):
    """
    Detect anomaly using IsolationForest with cyclical time features.
    Returns is_anomaly (bool) and confidence_score (float).
    """
    if iso_model is None:
        raise HTTPException(
            status_code=503,
            detail="IsolationForest model not loaded"
        )
    
    try:
        hour_sin, hour_cos, day_sin, day_cos = get_cyclical_features(request.timestamp)
        
        features = np.array([[
            hour_sin,
            hour_cos,
            day_sin,
            day_cos,
            request.units
        ]])
        
        prediction = iso_model.predict(features)[0]
        is_anomaly = bool(prediction == -1)
        
        confidence_score = None
        try:
            score = iso_model.score_samples(features)[0]
            confidence_score = float(round(abs(score), 4))
        except Exception as score_err:
            print(f"⚠️  Could not compute confidence score: {score_err}")
        
        return AnomalyResponse(
            is_anomaly=is_anomaly,
            confidence_score=confidence_score,
            units_received=request.units
        )
    
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Anomaly detection failed: {str(e)}")


@app.post("/api/ml/predict", response_model=PredictResponse)
async def predict_consumption(request: PredictRequest):
    """
    Predict energy consumption using LinearRegression with cyclical time features.
    Returns predicted_units_kWh for the target timestamp.
    """
    if lr_model is None:
        raise HTTPException(
            status_code=503,
            detail="LinearRegression model not loaded"
        )
    
    try:
        hour_sin, hour_cos, day_sin, day_cos = get_cyclical_features(request.target_timestamp)
        
        features = np.array([[
            hour_sin,
            hour_cos,
            day_sin,
            day_cos
        ]])
        
        predicted = float(lr_model.predict(features)[0])
        predicted = max(0.1, round(predicted, 3))
        
        return PredictResponse(
            predicted_units_kWh=predicted,
            target_timestamp=request.target_timestamp
        )
    
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.get("/")
async def root():
    """Root endpoint with service information."""
    return {
        "service": "ElectroGyaan ML Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "anomaly_detection": "/api/ml/anomaly",
            "prediction": "/api/ml/predict",
            "docs": "/docs"
        }
    }


if __name__ == "__main__":
    import uvicorn
    print("🚀 ElectroGyaan ML Service running on port 8000")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
