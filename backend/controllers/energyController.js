const axios = require('axios');
const EnergyData = require('../models/EnergyData');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
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

    const records = await EnergyData.find({ flatId })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    const ascending = records.reverse();

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
      const mlResponse = await axios.post(
        `${ML_SERVICE_URL}/api/ml/predict`,
        {
          target_timestamp: targetTimestamp
        },
        {
          timeout: ML_TIMEOUT_MS
        }
      );

      return res.status(200).json({
        success: true,
        predicted_units_kWh: mlResponse.data.predicted_units_kWh,
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
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const records = await EnergyData.find({
      flatId,
      timestamp: { $gte: last24h }
    }).lean();

    const totalConsumption = records.reduce((sum, r) => sum + r.units_kWh, 0);
    const avgConsumption = records.length > 0 ? totalConsumption / records.length : 0;
    const anomalyCount = records.filter(r => r.isAnomaly).length;

    const lastReading = await EnergyData.findOne({ flatId })
      .sort({ timestamp: -1 })
      .lean();

    const stats = {
      totalConsumption: parseFloat(totalConsumption.toFixed(2)),
      avgConsumption: parseFloat(avgConsumption.toFixed(2)),
      anomalyCount,
      lastReading: lastReading || null,
      recordCount: records.length
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
    if (flatId !== 'all') {
      filter.flatId = flatId;
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

    const heatmapData = await EnergyData.aggregate([
      { $match: { flatId } },
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
