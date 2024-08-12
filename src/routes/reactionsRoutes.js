import express from 'express';
import ReactionController from '../controllers/reactionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/reactions:
 *   post:
 *     summary: Ajouter ou supprimer une réaction pour un post ou un commentaire
 *     tags: [Reactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type de la réaction (e.g., like, love)
 *               postId:
 *                 type: string
 *                 description: ID du post pour la réaction (optionnel)
 *               commentId:
 *                 type: string
 *                 description: ID du commentaire pour la réaction (optionnel)
 *     responses:
 *       200:
 *         description: Réaction ajoutée ou supprimée avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Post ou commentaire non trouvé
 */
router.post('/', authMiddleware, ReactionController.toggleReaction);

/**
 * @swagger
 * /api/reactions/posts/{postId}:
 *   get:
 *     summary: Récupérer toutes les réactions pour un post spécifique
 *     tags: [Reactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post pour lequel récupérer les réactions
 *     responses:
 *       200:
 *         description: Liste des réactions pour le post
 *       404:
 *         description: Post non trouvé
 */
router.get('/posts/:postId', authMiddleware, ReactionController.getReactionsForPost);

/**
 * @swagger
 * /api/reactions/comments/{commentId}:
 *   get:
 *     summary: Récupérer toutes les réactions pour un commentaire spécifique
 *     tags: [Reactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire pour lequel récupérer les réactions
 *     responses:
 *       200:
 *         description: Liste des réactions pour le commentaire
 *       404:
 *         description: Commentaire non trouvé
 */
router.get('/comments/:commentId', authMiddleware, ReactionController.getReactionsForComment);

export default router;
