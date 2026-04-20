import mongoose from 'mongoose';

const energyDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'A101'
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  units_kWh: {
    type: Number,
    required: true
  },
  isAnomaly: {
    type: Boolean,
    default: false
  }
});

// High performance compound indexing for fetching a user's time series data
energyDataSchema.index({ userId: 1, timestamp: -1 });

const EnergyData = mongoose.model('EnergyData', energyDataSchema);

export default EnergyData;
