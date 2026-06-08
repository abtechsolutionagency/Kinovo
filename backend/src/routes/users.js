import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  getInterests,
  updateInterests,
  getPreferences,
  updatePreferences,
  ensureUploadDir,
} from '../controllers/profileController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const uploadDir = ensureUploadDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
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

export default router;
