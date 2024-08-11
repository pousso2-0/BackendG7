import express from 'express';
import MessageController from '../controllers/messageController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, MessageController.sendMessage);
router.get('/', authMiddleware, MessageController.getAllUserMessages);
router.get('/conversations', authMiddleware, MessageController.getConversations);
router.get('/:otherUserId', authMiddleware, MessageController.getMessagesWithUser);
router.delete('/:id', authMiddleware, MessageController.deleteMessage);

export default router;