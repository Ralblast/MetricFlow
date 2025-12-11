import Metric from '../models/Metric.js';
import Alert from '../models/Alert.js';
import { sendAlert } from './discordService.js';

export const detectAnomaly = async (orgId, metricType) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const stats = await Metric.aggregate([
      {
        $match: {
          orgId: orgId,
          type: metricType,
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          mean: { $avg: '$value' },
          stdDev: { $stdDevPop: '$value' }
        }
      }
    ]);

    if (!stats || stats.length === 0) {
      return null;
    }

    const mean = stats[0].mean;
    const stdDev = stats[0].stdDev;
    const warningThreshold = mean + (2 * stdDev);
    const criticalThreshold = mean + (3 * stdDev);

    const latestMetric = await Metric.findOne({
      orgId: orgId,
      type: metricType
    }).sort({ timestamp: -1 });

    if (!latestMetric) {
      return null;
    }

    if (latestMetric.value > warningThreshold) {
      const severity = latestMetric.value > criticalThreshold ? 'critical' : 'warning';

      const alert = await Alert.create({
        orgId: orgId,
        type: metricType,
        value: latestMetric.value,
        threshold: warningThreshold,
        severity: severity
      });

      await sendAlert({
        title: `🚨 ${metricType} Anomaly Detected`,
        value: latestMetric.value.toFixed(2),
        threshold: warningThreshold.toFixed(2),
        severity: severity
      });

      return alert;
    }

    return null;
  } catch (error) {
    console.error('Error in anomaly detection:', error.message);
    return null;
  }
};
