import cron from 'node-cron';
import Metric from '../models/Metric.js';
import Alert from '../models/Alert.js';

export const startCleanupJob = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      // Reduced from 30 days to 7 days for free tier (512 MB limit)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const metricsDeleted = await Metric.deleteMany({
        timestamp: { $lt: sevenDaysAgo }
      });

      const alertsDeleted = await Alert.deleteMany({
        timestamp: { $lt: sevenDaysAgo }
      });

      // Count current documents
      const currentMetricsCount = await Metric.countDocuments();
      const currentAlertsCount = await Alert.countDocuments();

      console.log(`Cleanup: Deleted ${metricsDeleted.deletedCount} old metrics and ${alertsDeleted.deletedCount} old alerts`);
      console.log(`Current DB state: ${currentMetricsCount} metrics, ${currentAlertsCount} alerts`);
      
      // Estimate storage (avg 250 bytes per document)
      const estimatedStorageMB = ((currentMetricsCount + currentAlertsCount) * 250) / (1024 * 1024);
      console.log(`Estimated storage: ${estimatedStorageMB.toFixed(2)} MB / 512 MB (${(estimatedStorageMB / 512 * 100).toFixed(1)}%)`);
      
      // Warn if approaching limit
      if (estimatedStorageMB > 400) {
        console.warn('⚠️  WARNING: Approaching 512 MB storage limit! Consider reducing retention further.');
      } else if (estimatedStorageMB > 300) {
        console.warn('⚠️  Storage at 60% - monitor closely.');
      }

    } catch (error) {
      console.error('Cleanup job error:', error.message);
    }
  });

  console.log('Cleanup job scheduled (runs daily at midnight)');
};
