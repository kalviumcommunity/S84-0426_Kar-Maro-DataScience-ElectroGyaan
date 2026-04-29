const axios = require('axios');
const EnergyData = require('../models/EnergyData');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
const ML_TIMEOUT_MS = parseInt(process.env.ML_TIMEOUT_MS) || 3000;

exports.ingestReading = async (req, res) => {
  try {
    const { flatId = 'A101', units } = req.body;

    if (!units || typeof units !== 'number' || units < 0) {
      return res.status(400).json({
        success: false,
        message: 'units must be a positive number'
      });
    }

    const timestamp = new Date();
    let isAnomaly = false;
    let mlConfidence = null;

    try {
      const mlResponse = await axios.post(
        `${ML_SERVICE_URL}/api/ml/anomaly`,
        {
          units: parseFloat(units),
          timestamp: timestamp.toISOString()
        },
        {
          timeout: ML_TIMEOUT_MS
        }
      );

      isAnomaly = mlResponse.data.is_anomaly || false;
      mlConfidence = mlResponse.data.confidence_score || null;
    } catch (mlError) {
      console.log('\x1b[33m[ML FALLBACK] FastAPI unreachable:', mlError.message, '\x1b[0m');
      isAnomaly = false;
      mlConfidence = null;
    }

    const energyRecord = new EnergyData({
      flatId,
      timestamp,
      units_kWh: parseFloat(units),
      isAnomaly,
      mlConfidence
    });

    const savedDoc = await energyRecord.save();

    return res.status(201).json({
      success: true,
      data: savedDoc
    });
  } catch (error) {
    console.error('Ingest error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { flatId } = req.params;

    let ascending = [];

    if (flatId === 'Admin' || flatId === 'all') {
      // Admin dashboard: fetch just recent data and group
      const recentLimit = new Date(Date.now() - 10 * 60 * 1000); // last 10 minutes is plenty for 50 readings 
      const fetchFlats = Array.from({length: 50}, (_, i) => `A${101 + i}`);
      
      const records = await EnergyData.aggregate([
        { $match: { flatId: { $in: fetchFlats }, timestamp: { $gte: recentLimit } } },
        {
          $group: {
            _id: {
              $subtract: [
                { $toLong: "$timestamp" },
                { $mod: [{ $toLong: "$timestamp" }, 5000] }
              ]
            },
            units_kWh: { $sum: "$units_kWh" },
            isAnomaly: { $max: "$isAnomaly" }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 50 },
        {
          $project: {
            _id: 0,
            timestamp: { $toDate: "$_id" },
            units_kWh: 1,
            isAnomaly: { $cond: [{ $eq: ["$isAnomaly", true] }, true, false] }
          }
        },
        { $sort: { timestamp: 1 } }
      ]);
      ascending = records;
    } else {
      const query = { flatId };
      const records = await EnergyData.find(query)
        .sort({ timestamp: -1 })
        .limit(50)
        .lean();
      ascending = records.reverse();
    }

    return res.status(200).json({
      success: true,
      count: ascending.length,
      data: ascending
    });
  } catch (error) {
    console.error('Get history error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPrediction = async (req, res) => {
  try {
    const { flatId } = req.params;
    const targetTimestamp = new Date(Date.now() + 3600000).toISOString();

    try {
      const payloadId = (flatId === 'Admin' || flatId === 'all') ? 'A101' : flatId; // Approximate using base flat + scale factor, or just base flat
      const mlResponse = await axios.post(
        `${ML_SERVICE_URL}/api/ml/predict`,
        {
          target_timestamp: targetTimestamp
        },
        {
          timeout: ML_TIMEOUT_MS
        }
      );

      // Scale up prediction if we are calculating for 50 apartments
      let predUnits = mlResponse.data.predicted_units_kWh;
      if (flatId === 'Admin' || flatId === 'all') {
         predUnits = predUnits * 50;
      }

      return res.status(200).json({
        success: true,
        predicted_units_kWh: predUnits,
        target_timestamp: mlResponse.data.target_timestamp,
        flatId
      });
    } catch (mlError) {
      return res.status(503).json({
        success: false,
        message: 'ML service unavailable'
      });
    }
  } catch (error) {
    console.error('Get prediction error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const { flatId } = req.params;
    
    // Changing from last24h to start of month for consumption
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const query = (flatId === 'Admin' || flatId === 'all') 
      ? { flatId: { $in: Array.from({length: 50}, (_, i) => `A${101 + i}`) }, timestamp: { $gte: startOfMonth } } 
      : { flatId, timestamp: { $gte: startOfMonth } };

    const aggData = await EnergyData.aggregate([
      { $match: query },
      { 
        $group: {
          _id: null,
          totalConsumption: { $sum: "$units_kWh" },
          anomalyCount: { $sum: { $cond: [{ $eq: ["$isAnomaly", true] }, 1, 0] } },
          recordCount: { $sum: 1 }
        }
      }
    ]);

    const result = aggData[0] || { totalConsumption: 0, anomalyCount: 0, recordCount: 0 };
    
    const daysPassed = Math.max(1, new Date().getDate());
    
    // Normalize consumption to prevent simulator interval inflation
    let realisticTotalConsumption = 0;
    if (result.recordCount > 0) {
      const avgPower = result.totalConsumption / result.recordCount;
      const activeFlatsCount = (flatId === 'Admin' || flatId === 'all') ? 50 : 1;
      realisticTotalConsumption = avgPower * 24 * daysPassed * activeFlatsCount;
    }

    let avgConsumption = 0;
    if (flatId === 'Admin' || flatId === 'all') {
      avgConsumption = realisticTotalConsumption / (50 * daysPassed);
    } else {
      avgConsumption = realisticTotalConsumption / daysPassed;
    }

    const lastReadingQuery = (flatId === 'Admin' || flatId === 'all') ? {} : { flatId };
    const lastReading = await EnergyData.findOne(lastReadingQuery)
      .sort({ timestamp: -1 })
      .lean();

    const stats = {
      totalConsumption: parseFloat(realisticTotalConsumption.toFixed(2)),
      avgConsumption: parseFloat(avgConsumption.toFixed(2)),
      anomalyCount: result.anomalyCount,
      lastReading: lastReading || null,
      recordCount: result.recordCount
    };

    return res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAnomalies = async (req, res) => {
  try {
    const { flatId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    const filter = { isAnomaly: true };
    if (flatId !== 'all' && flatId !== 'Admin') {
      filter.flatId = flatId;
    } else {
      const fetchFlats = Array.from({length: 50}, (_, i) => `A${101 + i}`);
      filter.flatId = { $in: fetchFlats };
      filter.timestamp = { $gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) };
    }

    const total = await EnergyData.countDocuments(filter);
    const anomalies = await EnergyData.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const pages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      pages,
      data: anomalies
    });
  } catch (error) {
    console.error('Get anomalies error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getHourlyPattern = async (req, res) => {
  try {
    const { flatId } = req.params;

    const fetchFlats = Array.from({length: 50}, (_, i) => `A${101 + i}`);
    const matchQuery = (flatId === 'all' || flatId === 'Admin') 
      ? { flatId: { $in: fetchFlats }, timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } 
      : { flatId };

    const heatmapData = await EnergyData.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            hour: { $hour: '$timestamp' },
            dayOfWeek: { $dayOfWeek: '$timestamp' }
          },
          avgUnits: { $avg: '$units_kWh' }
        }
      },
      {
        $project: {
          _id: 0,
          hour: '$_id.hour',
          dayOfWeek: '$_id.dayOfWeek',
          avgUnits: { $round: ['$avgUnits', 3] }
        }
      },
      { $sort: { dayOfWeek: 1, hour: 1 } }
    ]);

    return res.status(200).json({
      success: true,
      data: heatmapData
    });
  } catch (error) {
    console.error('Get hourly pattern error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllFlatsStats = async (req, res) => {
  try {
    const flats = [];
    
    for (let i = 101; i <= 150; i++) {
      const flatId = `A${i}`;
      const latestReading = await EnergyData.findOne({ flatId })
        .sort({ timestamp: -1 })
        .lean();

      if (latestReading) {
        flats.push({
          flatId,
          units_kWh: latestReading.units_kWh,
          isAnomaly: latestReading.isAnomaly,
          timestamp: latestReading.timestamp
        });
      } else {
        flats.push({
          flatId,
          units_kWh: 0,
          isAnomaly: false,
          timestamp: null
        });
      }
    }

    // Sort by flat ID ascending (A101, A102, ... A150)
    flats.sort((a, b) => parseInt(a.flatId.slice(1)) - parseInt(b.flatId.slice(1)));

    return res.status(200).json({
      success: true,
      data: flats
    });
  } catch (error) {
    console.error('Get all flats stats error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
