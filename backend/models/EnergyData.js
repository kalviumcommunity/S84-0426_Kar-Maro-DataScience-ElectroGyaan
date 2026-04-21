const mongoose = require('mongoose');

const energyDataSchema = new mongoose.Schema({
  flatId: {
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
  },
  mlConfidence: {
    type: Number,
    default: null
  }
}, {
  timestamps: false
});

energyDataSchema.index({ flatId: 1, timestamp: -1 });

energyDataSchema.virtual('deviationPercent').get(function() {
  const baseline = 2.0;
  if (this.units_kWh && baseline > 0) {
    return ((this.units_kWh - baseline) / baseline * 100).toFixed(2);
  }
  return 0;
});

energyDataSchema.set('toJSON', { virtuals: true });
energyDataSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('EnergyData', energyDataSchema);
