import cron from 'node-cron';
import Organization from '../models/Organization.js';
import { detectAnomaly } from '../services/anomalyDetector.js';

export const startAnomalyMonitor = () => {
  cron.schedule('*/1 * * * *', async () => {
    try {
      const orgs = await Organization.find();

      for (const org of orgs) {
        await detectAnomaly(org._id, 'CPU');
        await detectAnomaly(org._id, 'Memory');
        await detectAnomaly(org._id, 'Latency');
      }
    } catch (error) {
      console.error('Anomaly monitor error:', error.message);
    }
  });

  console.log('Anomaly monitor started (runs every 1 minute)');
};
