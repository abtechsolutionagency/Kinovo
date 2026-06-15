import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { imageUpload } from '../middleware/imageUpload.js';
import { uploadCoverImage } from '../controllers/uploadController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(requireAuth);

router.post('/image', imageUpload.single('image'), asyncHandler(uploadCoverImage));

export default router;
