import EnergyData from '../models/EnergyData.js';
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
