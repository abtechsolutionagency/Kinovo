import { Router } from 'express';
import {
  sendConnectionRequest,
  listConnections,
  updateConnection,
} from '../controllers/connectionController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(requireAuth);

router.post('/', asyncHandler(sendConnectionRequest));
router.get('/', asyncHandler(listConnections));
router.patch('/:id', asyncHandler(updateConnection));

export default router;
