from pydantic import BaseModel, validator
from typing import Optional


class AnomalyRequest(BaseModel):
    units: float
    timestamp: str

    @validator('units')
    def units_must_be_positive(cls, v):
        if v < 0:
            raise ValueError('units must be non-negative')
        return round(v, 4)


class PredictRequest(BaseModel):
    target_timestamp: str


class AnomalyResponse(BaseModel):
    is_anomaly: bool
    confidence_score: Optional[float] = None
    units_received: float


class PredictResponse(BaseModel):
    predicted_units_kWh: float
    target_timestamp: str


class HealthResponse(BaseModel):
    status: str
    models_loaded: bool
    iso_model: bool
    lr_model: bool
