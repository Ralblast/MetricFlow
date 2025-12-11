import Alert from '../models/Alert.js';
import mongoose from 'mongoose';

export const getAlerts = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const orgId = new mongoose.Types.ObjectId(req.user.orgId);

    const alerts = await Alert.find({ orgId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({ alerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAlertStats = async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const orgId = new mongoose.Types.ObjectId(req.user.orgId);

    const timeAgo = new Date(Date.now() - hours * 60 * 60 * 1000);

    const alerts = await Alert.find({
      orgId,
      timestamp: { $gte: timeAgo }
    });

    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const warningCount = alerts.filter(a => a.severity === 'warning').length;

    res.status(200).json({
      total: alerts.length,
      critical: criticalCount,
      warning: warningCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
