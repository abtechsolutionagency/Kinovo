import { Router } from 'express';
import {
  getPlans,
  getSubscriptionStatus,
  createCheckoutSession,
  createPortalSession,
  verifyCheckoutSession,
} from '../controllers/billingController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/plans', asyncHandler(getPlans));
router.get('/status', requireAuth, asyncHandler(getSubscriptionStatus));
router.get('/verify', requireAuth, asyncHandler(verifyCheckoutSession));
router.post('/checkout', requireAuth, asyncHandler(createCheckoutSession));
router.post('/portal', requireAuth, asyncHandler(createPortalSession));

export default router;
