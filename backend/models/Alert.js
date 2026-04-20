import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['WARNING', 'CRITICAL'],
    default: 'WARNING'
  }
});

alertSchema.index({ userId: 1, timestamp: -1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
