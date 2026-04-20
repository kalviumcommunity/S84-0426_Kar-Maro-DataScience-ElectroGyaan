import EnergyData from '../models/EnergyData.js';
import Alert from '../models/Alert.js';
import axios from 'axios';

// @desc    Get a list of all unique users
// @route   GET /api/energy/users
export const getUsers = async (req, res) => {
  try {
    const users = await EnergyData.distinct('userId');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get historical energy data for a specific user
// @route   GET /api/energy/:userId
export const getEnergyData = async (req, res) => {
  try {
    const { userId } = req.params;
    // Default to last 7 days (168 hours) if not specified
    const limit = parseInt(req.query.limit) || 168; 

    // Find user's data, sort by the most recent first, then reverse so it's chronological for charts
    const data = await EnergyData.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.status(200).json({ success: true, count: data.length, data: data.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Ingest real-time energy usage data
// @route   POST /api/energy/ingest
export const ingestEnergyData = async (req, res) => {
  try {
    const { userId, units_kWh, timestamp } = req.body;

    const recordTime = timestamp ? new Date(timestamp) : new Date();

    // ML ANOMALY DETECTION 
    let isAnomaly = false;
    let mlPrediction = false;

    // Call Python ML service if available
    try {
      const mlApi = process.env.ML_SERVICE_URL || 'http://localhost:8000';
      const mlResponse = await axios.post(`${mlApi}/api/ml/anomaly`, {
        units: units_kWh,
        timestamp: recordTime.toISOString()
      }, { timeout: parseInt(process.env.ML_TIMEOUT) || 2000 }); // strict 2s timeout
      
      isAnomaly = mlResponse.data.is_anomaly;
      mlPrediction = true;
    } catch (err) {
      console.warn(`[ML Service Warning] Failed to reach ML model: ${err.message}. Falling back to rules threshold.`);
      // Rule-based threshold fallback: Anything over 10 kWh is an anomaly
      isAnomaly = units_kWh > 10;
    }

    // Save actual ingested data
    const newData = new EnergyData({
      userId,
      units_kWh,
      timestamp: recordTime,
      isAnomaly,
    });
    await newData.save();

    // Generate Alert if it's an anomaly or excessively high
    if (isAnomaly || units_kWh > 15) {
      await Alert.create({
        userId,
        timestamp: recordTime,
        message: mlPrediction ? `AI identified usage anomaly: ${units_kWh} kWh` : `Threshold alert triggered: ${units_kWh} kWh`,
        severity: units_kWh >= 15 ? 'CRITICAL' : 'WARNING'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Data ingested successfully',
      data: newData,
      ml_used: mlPrediction
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get alerts for a specific user
// @route   GET /api/energy/:userId/alerts
export const getAlerts = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const alerts = await Alert.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
