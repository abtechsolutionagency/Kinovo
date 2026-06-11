import { Router } from 'express';
import { listTravels, getTravel } from '../controllers/travelController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(listTravels));
router.get('/:id', asyncHandler(getTravel));

export default router;
