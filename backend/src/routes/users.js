import { Router } from 'express';
import { imageUpload } from '../middleware/imageUpload.js';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  getInterests,
  updateInterests,
  getPreferences,
  updatePreferences,
} from '../controllers/profileController.js';
import {
  discoverTravelers,
  getTravelerProfile,
  getMatchScore,
} from '../controllers/discoverController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const upload = imageUpload;

const router = Router();

router.use(requireAuth);

router.get('/me', asyncHandler(getProfile));
router.patch('/me', asyncHandler(updateProfile));
router.post('/me/avatar', upload.single('avatar'), asyncHandler(uploadAvatar));
router.get('/me/interests', asyncHandler(getInterests));
router.put('/me/interests', asyncHandler(updateInterests));
router.get('/me/preferences', asyncHandler(getPreferences));
router.put('/me/preferences', asyncHandler(updatePreferences));

router.get('/discover', asyncHandler(discoverTravelers));
router.get('/:id/match-score', asyncHandler(getMatchScore));
router.get('/:id', asyncHandler(getTravelerProfile));

export default router;
