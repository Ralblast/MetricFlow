import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAlerts, getAlertStats } from '../controllers/alertController.js';

const router = express.Router();

router.use(protect);

router.get('/', getAlerts);
router.get('/stats', getAlertStats);

export default router;
