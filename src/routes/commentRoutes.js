// src/routes/commentRoutes.js
import express from 'express';
import CommentController from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { checkCommentsEnabled } from '../middleware/commentMiddleware.js';

const router = express.Router();

router.post('/:postId', authMiddleware, checkCommentsEnabled, CommentController.createComment);
router.get('/:id', CommentController.getComment);
router.put('/:id', authMiddleware, CommentController.updateComment);
router.delete('/:id', authMiddleware, CommentController.deleteComment);

export default router;