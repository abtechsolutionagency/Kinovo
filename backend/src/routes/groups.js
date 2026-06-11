import { Router } from 'express';
import {
  createGroup,
  updateGroup,
  listGroups,
  getGroup,
  joinGroup,
  leaveGroup,
} from '../controllers/groupController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(listGroups));
router.post('/', asyncHandler(createGroup));
router.get('/:id', asyncHandler(getGroup));
router.patch('/:id', asyncHandler(updateGroup));
router.post('/:id/join', asyncHandler(joinGroup));
router.delete('/:id/members/me', asyncHandler(leaveGroup));

export default router;
