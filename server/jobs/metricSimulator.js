import cron from 'node-cron';
import Metric from '../models/Metric.js';
import Organization from '../models/Organization.js';

const generateRandomMetric = (type, baseValue) => {
  const variance = baseValue * 0.2;
  const random = Math.random() * variance * 2 - variance;
  return Math.max(0, Math.min(100, baseValue + random));
};

export const startMetricSimulator = () => {
  cron.schedule('*/30 * * * * *', async () => {
    try {
      const orgs = await Organization.find();

      for (const org of orgs) {
        const cpuValue = generateRandomMetric('CPU', 45);
        const memoryValue = generateRandomMetric('Memory', 60);
        const latencyValue = generateRandomMetric('Latency', 150);

        await Metric.create([
          {
            orgId: org._id,
            type: 'CPU',
            value: cpuValue,
            metadata: { serverId: 'server-01', region: 'us-east-1' }
          },
          {
            orgId: org._id,
            type: 'Memory',
            value: memoryValue,
            metadata: { serverId: 'server-01', region: 'us-east-1' }
          },
          {
            orgId: org._id,
            type: 'Latency',
            value: latencyValue,
            metadata: { serverId: 'server-01', region: 'us-east-1' }
          }
        ]);
      }
    } catch (error) {
      console.error('Metric simulator error:', error.message);
    }
  });

  console.log('Metric simulator started (runs every 30 seconds)');
};
