import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/authRoutes.js';
import metricRoutes from './routes/metricRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import apiEndpointRoutes from './routes/apiEndpointRoutes.js';
import { startMetricSimulator } from './jobs/metricSimulator.js';
import { startAnomalyMonitor } from './jobs/anomalyMonitor.js';
import { startDailyReportJob } from './jobs/reportJob.js';
import { startApiMonitorJob } from './jobs/apiMonitorJob.js';
import { startCleanupJob } from './jobs/cleanupJob.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', apiLimiter);


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});


app.use('/api/auth', authRoutes);
app.use('/api/metrics', metricRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/endpoints', apiEndpointRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

startMetricSimulator();
startAnomalyMonitor();
startDailyReportJob();
startApiMonitorJob();
startCleanupJob();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
