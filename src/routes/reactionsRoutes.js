// src/routes/reactionRoutes.js
import express from 'express';
import ReactionController from '../controllers/reactionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

// Ajouter ou supprimer une réaction pour un post ou un commentaire
router.post('/',authMiddleware, ReactionController.toggleReaction);




// Récupérer toutes les réactions pour un post
router.get('/posts/:postId',authMiddleware, ReactionController.getReactionsForPost);

// Récupérer toutes les réactions pour un commentaire
router.get('/comments/:commentId',authMiddleware, ReactionController.getReactionsForComment);

export default router;
