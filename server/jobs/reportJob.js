import cron from 'node-cron';
import Organization from '../models/Organization.js';
import Alert from '../models/Alert.js';
import { getMetricStats } from '../services/aggregationService.js';
import { generateDailyReport } from '../services/pdfService.js';
import { sendDailyReport } from '../services/discordService.js';

export const startDailyReportJob = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const orgs = await Organization.find();

      for (const org of orgs) {
        const cpuStats = await getMetricStats(org._id, 'CPU', 24);
        const memoryStats = await getMetricStats(org._id, 'Memory', 24);
        const latencyStats = await getMetricStats(org._id, 'Latency', 24);

        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const alerts = await Alert.find({
          orgId: org._id,
          timestamp: { $gte: oneDayAgo }
        });

        const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
        const warningAlerts = alerts.filter(a => a.severity === 'warning').length;

        const reportData = {
          orgName: org.name,
          date: new Date().toLocaleDateString(),
          avgCPU: cpuStats?.avg || 0,
          avgMemory: memoryStats?.avg || 0,
          avgLatency: latencyStats?.avg || 0,
          totalAlerts: alerts.length,
          criticalAlerts: criticalAlerts,
          warningAlerts: warningAlerts
        };

        await generateDailyReport(reportData);
        await sendDailyReport(reportData);
      }

      console.log('Daily reports generated successfully');
    } catch (error) {
      console.error('Report job error:', error.message);
    }
  });

  console.log('Daily report job scheduled (runs at midnight)');
};
