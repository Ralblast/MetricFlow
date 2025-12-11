import Metric from '../models/Metric.js';

export const getMetrics = async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 1;
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    const metrics = await Metric.find({
      orgId: req.user.orgId,
      timestamp: { $gte: startTime }
    })
    .sort({ timestamp: -1 })
    .lean();

    res.json({ metrics });
  } catch (error) {
    console.error('getMetrics error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getLatestMetrics = async (req, res) => {
  try {
    const latestCPU = await Metric.findOne({
      orgId: req.user.orgId,
      type: 'CPU'
    }).sort({ timestamp: -1 });

    const latestMemory = await Metric.findOne({
      orgId: req.user.orgId,
      type: 'Memory'
    }).sort({ timestamp: -1 });

    const latestLatency = await Metric.findOne({
      orgId: req.user.orgId,
      type: 'Latency'
    }).sort({ timestamp: -1 });

    const result = {
      cpu: latestCPU?.value || 0,
      memory: latestMemory?.value || 0,
      latency: latestLatency?.value || 0
    };
    
    res.json(result);
  } catch (error) {
    console.error('getLatestMetrics error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const createMetric = async (req, res) => {
  try {
    const { type, value, metadata } = req.body;

    const metric = await Metric.create({
      orgId: req.user.orgId,
      type,
      value,
      metadata,
      timestamp: new Date()
    });

    res.status(201).json(metric);
  } catch (error) {
    console.error('createMetric error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getMetricStatistics = async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    const metrics = await Metric.find({
      orgId: req.user.orgId,
      timestamp: { $gte: startTime }
    });

    const stats = {
      cpu: {
        avg: 0,
        min: 0,
        max: 0
      },
      memory: {
        avg: 0,
        min: 0,
        max: 0
      },
      latency: {
        avg: 0,
        min: 0,
        max: 0
      }
    };

    ['CPU', 'Memory', 'Latency'].forEach(type => {
      const typeMetrics = metrics.filter(m => m.type === type);
      if (typeMetrics.length > 0) {
        const values = typeMetrics.map(m => m.value);
        const key = type.toLowerCase();
        stats[key].avg = values.reduce((a, b) => a + b, 0) / values.length;
        stats[key].min = Math.min(...values);
        stats[key].max = Math.max(...values);
      }
    });

    res.json(stats);
  } catch (error) {
    console.error('getMetricStatistics error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
