import cron from 'node-cron';
import Organization from '../models/Organization.js';
import ApiEndpoint from '../models/ApiEndpoint.js';
import { pingApiEndpoint } from '../services/apiMonitor.js';

export const startApiMonitorJob = () => {
  cron.schedule('*/30 * * * * *', async () => {
    try {
      console.log('[API Monitor] Cron job triggered at', new Date().toISOString());
      
      const orgs = await Organization.find();
      console.log(`[API Monitor] Found ${orgs.length} organizations`);

      for (const org of orgs) {
        console.log(`[API Monitor] Checking org: ${org.name} (${org._id})`);
        
        const endpoints = await ApiEndpoint.find({
          orgId: org._id,
          isActive: true
        });
        
        console.log(`[API Monitor] Found ${endpoints.length} active endpoints for ${org.name}`);

        for (const endpoint of endpoints) {
          console.log(`[API Monitor] Pinging ${endpoint.name} at ${endpoint.url}`);
          const result = await pingApiEndpoint(org._id, endpoint);
          console.log(`[API Monitor] ✓ ${endpoint.name}: ${result.latency}ms (success: ${result.success})`);
        }
      }
      
      console.log('[API Monitor] Cron job completed');
    } catch (error) {
      console.error('[API Monitor] ERROR:', error.message);
      console.error('[API Monitor] Stack:', error.stack);
    }
  });

  console.log('API monitor job started (runs every 30 seconds)');
};
