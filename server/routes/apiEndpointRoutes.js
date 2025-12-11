import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getEndpoints,
  createEndpoint,
  deleteEndpoint,
  toggleEndpoint
} from '../controllers/apiEndpointController.js';

const router = express.Router();

router.use(protect);

router.get('/', getEndpoints);
router.post('/', createEndpoint);
router.delete('/:id', deleteEndpoint);
router.patch('/:id/toggle', toggleEndpoint);

export default router;
