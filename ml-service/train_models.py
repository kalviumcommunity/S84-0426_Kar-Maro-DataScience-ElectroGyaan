"""
ElectroGyaan AI - Model Training Script
This script trains the IsolationForest and LinearRegression models
and saves them to the models directory.
"""

import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import IsolationForest
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

print("🔌 ElectroGyaan AI - Model Training")
print("=" * 50)

# Load dataset
print("\n📂 Loading dataset...")
df = pd.read_csv("../backend/electrogyaan_dataset.csv")
print(f"✓ Loaded {len(df)} records")

# Preprocessing
print("\n🧹 Preprocessing data...")
df["timestamp"] = pd.to_datetime(df["timestamp"])
df["is_anomaly"] = df["is_anomaly"].astype(int)

# Feature Engineering - Cyclical encoding
print("\n⚙️  Engineering features...")
df["hour"] = df["timestamp"].dt.hour
df["day_of_week"] = df["timestamp"].dt.dayofweek

# Cyclical encoding for hour (0-23)
df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)

# Cyclical encoding for day of week (0-6)
df["day_sin"] = np.sin(2 * np.pi * df["day_of_week"] / 7)
df["day_cos"] = np.cos(2 * np.pi * df["day_of_week"] / 7)

print(f"✓ Created cyclical features: hour_sin, hour_cos, day_sin, day_cos")

# Split data
print("\n📊 Splitting data (80/20 train/test)...")
train, test = train_test_split(df, test_size=0.2, random_state=42)
print(f"✓ Train: {len(train)} | Test: {len(test)}")

# ============================================
# 1. ANOMALY DETECTION - IsolationForest
# ============================================
print("\n🤖 Training IsolationForest for Anomaly Detection...")
print("   Features: hour_sin, hour_cos, day_sin, day_cos, units_kWh")

iso_features = ["hour_sin", "hour_cos", "day_sin", "day_cos", "units_kWh"]
iso_model = IsolationForest(
    contamination=0.05,  # 5% expected anomaly rate
    random_state=42,
    n_estimators=100
)

iso_model.fit(train[iso_features])
print("✓ IsolationForest trained successfully")

# Test anomaly detection
test_predictions = iso_model.predict(test[iso_features])
test_anomalies = (test_predictions == -1).sum()
print(f"   Detected {test_anomalies} anomalies in test set ({test_anomalies/len(test)*100:.1f}%)")

# ============================================
# 2. PREDICTION - LinearRegression
# ============================================
print("\n🤖 Training LinearRegression for Consumption Prediction...")
print("   Features: hour_sin, hour_cos, day_sin, day_cos")
print("   Target: units_kWh")

lr_features = ["hour_sin", "hour_cos", "day_sin", "day_cos"]
X_train = train[lr_features]
y_train = train["units_kWh"]

lr_model = LinearRegression()
lr_model.fit(X_train, y_train)
print("✓ LinearRegression trained successfully")

# Test prediction
X_test = test[lr_features]
y_test = test["units_kWh"]
test_predictions = lr_model.predict(X_test)
mae = np.mean(np.abs(test_predictions - y_test))
print(f"   Mean Absolute Error on test set: {mae:.3f} kWh")

# ============================================
# 3. SAVE MODELS
# ============================================
print("\n💾 Saving models...")

# Create models directory if it doesn't exist
models_dir = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(models_dir, exist_ok=True)

# Save IsolationForest
iso_path = os.path.join(models_dir, "iso_model.pkl")
joblib.dump(iso_model, iso_path)
print(f"✓ Saved IsolationForest to: {iso_path}")

# Save LinearRegression
lr_path = os.path.join(models_dir, "lr_model.pkl")
joblib.dump(lr_model, lr_path)
print(f"✓ Saved LinearRegression to: {lr_path}")

print("\n" + "=" * 50)
print("✅ Model training complete!")
print("\nNext steps:")
print("1. Start ML service: cd ml-service && uvicorn main:app --reload --port 8000")
print("2. Start backend: cd backend && npm run dev")
print("3. Start simulator: cd backend && node simulator.js")
print("4. Start frontend: cd frontend && npm run dev")
