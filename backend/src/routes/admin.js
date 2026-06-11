import { Router } from 'express';
import {
  adminListTravels,
  adminCreateTravel,
  adminGetTravel,
  adminUpdateTravel,
  adminDeleteTravel,
} from '../controllers/travelController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/health', asyncHandler((_req, res) => {
  res.json({ success: true, message: 'Admin access confirmed' });
}));

router.get('/travels', asyncHandler(adminListTravels));
router.post('/travels', asyncHandler(adminCreateTravel));
router.get('/travels/:id', asyncHandler(adminGetTravel));
router.patch('/travels/:id', asyncHandler(adminUpdateTravel));
router.delete('/travels/:id', asyncHandler(adminDeleteTravel));

export default router;
