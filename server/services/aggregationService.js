import Metric from '../models/Metric.js';

export const getMetricStats = async (orgId, metricType, hours = 24) => {
  const timeAgo = new Date(Date.now() - hours * 60 * 60 * 1000);

  const stats = await Metric.aggregate([
    {
      $match: {
        orgId: orgId,
        type: metricType,
        timestamp: { $gte: timeAgo }
      }
    },
    {
      $group: {
        _id: null,
        avg: { $avg: '$value' },
        min: { $min: '$value' },
        max: { $max: '$value' },
        count: { $sum: 1 }
      }
    }
  ]);

  return stats.length > 0 ? stats[0] : null;
};

export const getRecentMetrics = async (orgId, limit = 100) => {
  const metrics = await Metric.find({ orgId: orgId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();

  return metrics;
};

export const getMetricsByTimeRange = async (orgId, startTime, endTime) => {
  const metrics = await Metric.find({
    orgId: orgId,
    timestamp: {
      $gte: startTime,
      $lte: endTime
    }
  }).sort({ timestamp: 1 }).lean();

  return metrics;
};
