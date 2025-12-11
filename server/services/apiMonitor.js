import axios from 'axios';
import Metric from '../models/Metric.js';

export const pingApiEndpoint = async (orgId, endpoint) => {
  const startTime = Date.now();
  let success = false;
  let latency = 0;

  try {
    const response = await axios({
      method: endpoint.method,
      url: endpoint.url,
      timeout: 10000,
      validateStatus: () => true,
    });

    latency = Date.now() - startTime;
    success = response.status >= 200 && response.status < 500;
  } catch (error) {
    latency = Date.now() - startTime;
    success = false;
  }

  await Metric.create({
    orgId,
    type: 'Latency',
    value: latency,
    metadata: {
      url: endpoint.url,
      serverId: `api-${endpoint.name}`,
      method: endpoint.method,
      endpointId: endpoint._id,
      source: 'user-api',
      region: 'real-api',
      success,
    },
  });

  return { latency, success };
};
