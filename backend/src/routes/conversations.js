import { Router } from 'express';
import {
  createConversation,
  listConversations,
  getConversation,
  getMessages,
  sendMessage,
  markConversationRead,
  searchConversations,
} from '../controllers/conversationController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(requireAuth);

router.get('/search', asyncHandler(searchConversations));
router.get('/', asyncHandler(listConversations));
router.post('/', asyncHandler(createConversation));
router.get('/:id', asyncHandler(getConversation));
router.get('/:id/messages', asyncHandler(getMessages));
router.post('/:id/messages', asyncHandler(sendMessage));
router.patch('/:id/read', asyncHandler(markConversationRead));

export default router;
