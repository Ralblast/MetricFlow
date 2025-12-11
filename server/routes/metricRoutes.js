import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getMetrics,
  getLatestMetrics,
  getMetricStatistics,
  createMetric
} from '../controllers/metricController.js';

const router = express.Router();

router.use(protect);

router.get('/', getMetrics);
router.get('/latest', getLatestMetrics);
router.get('/stats', getMetricStatistics);
router.post('/', createMetric);

export default router;
