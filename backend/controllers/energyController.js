import EnergyData from '../models/EnergyData.js';
import axios from 'axios';

// @desc    Ingest real-time energy usage data
// @route   POST /api/energy/ingest
export const ingestEnergyData = async (req, res) => {
  try {
    const { userId, units_kWh, timestamp } = req.body;

    const recordTime = timestamp ? new Date(timestamp) : new Date();

    // ML ANOMALY DETECTION (Placeholder for PR 6)
    let isAnomaly = false;

    const newData = new EnergyData({
      userId,
      units_kWh,
      timestamp: recordTime,
      isAnomaly,
    });

    await newData.save();

    res.status(201).json({
      success: true,
      message: 'Data ingested successfully',
      data: newData,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
