import { Router } from 'express';
import {
  signup,
  login,
  logout,
  me,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));
router.post('/logout', requireAuth, asyncHandler(logout));
router.get('/me', requireAuth, asyncHandler(me));
router.post('/forgot-password', asyncHandler(forgotPassword));
router.post('/reset-password', asyncHandler(resetPassword));
router.post('/change-password', requireAuth, asyncHandler(changePassword));

export default router;
