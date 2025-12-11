import mongoose from 'mongoose';

const metricSchema = new mongoose.Schema({
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
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'minutes'
  }
});

metricSchema.index({ orgId: 1, timestamp: -1 });
metricSchema.index({ orgId: 1, type: 1, timestamp: -1 });

export default mongoose.model('Metric', metricSchema);
