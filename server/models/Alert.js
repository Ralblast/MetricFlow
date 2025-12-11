import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  type: {
    type: String,
    enum: ['CPU', 'Memory', 'Latency'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  severity: {
    type: String,
    enum: ['warning', 'critical'],
    default: 'warning'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

alertSchema.index({ orgId: 1, timestamp: -1 });

export default mongoose.model('Alert', alertSchema);
