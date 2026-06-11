import { Router } from 'express';
import multer from 'multer';
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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'));
    }
  },
});

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
