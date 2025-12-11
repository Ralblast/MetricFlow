import axios from 'axios';

export const sendAlert = async (alertData) => {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    console.log('Discord webhook not configured, skipping alert');
    return;
  }

  try {
    const embed = {
      title: alertData.title,
      description: `**Value:** ${alertData.value}\n**Threshold:** ${alertData.threshold}`,
      color: alertData.severity === 'critical' ? 15158332 : 16776960,
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Sentinel Monitor'
      }
    };

    await axios.post(process.env.DISCORD_WEBHOOK_URL, {
      embeds: [embed]
    });

    console.log('Discord alert sent successfully');
  } catch (error) {
    console.error('Failed to send Discord alert:', error.message);
  }
};

export const sendDailyReport = async (reportData) => {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    console.log('Discord webhook not configured, skipping report');
    return;
  }

  try {
    const embed = {
      title: '📊 Daily Performance Report',
      description: `Report generated for ${reportData.date}`,
      color: 3447003,
      fields: [
        {
          name: 'Average CPU',
          value: `${reportData.avgCPU.toFixed(2)}%`,
          inline: true
        },
        {
          name: 'Average Memory',
          value: `${reportData.avgMemory.toFixed(2)}%`,
          inline: true
        },
        {
          name: 'Total Alerts',
          value: `${reportData.totalAlerts}`,
          inline: true
        }
      ],
      timestamp: new Date().toISOString()
    };

    await axios.post(process.env.DISCORD_WEBHOOK_URL, {
      content: '📊 Daily Report Generated!',
      embeds: [embed]
    });

    console.log('Daily report sent to Discord');
  } catch (error) {
    console.error('Failed to send Discord report:', error.message);
  }
};
