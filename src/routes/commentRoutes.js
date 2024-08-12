import express from 'express';
import CommentController from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { checkCommentsEnabled } from '../middleware/commentMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/comments/{postId}:
 *   post:
 *     summary: Ajouter un commentaire à un post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post auquel ajouter un commentaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Contenu du commentaire
 *     responses:
 *       201:
 *         description: Commentaire créé avec succès
 *       400:
 *         description: Données invalides ou commentaires désactivés
 *       401:
 *         description: Non autorisé, authentification requise
 */
router.post('/:postId', authMiddleware, checkCommentsEnabled, CommentController.createComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: Récupérer un commentaire spécifique
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire à récupérer
 *     responses:
 *       200:
 *         description: Commentaire récupéré avec succès
 *       404:
 *         description: Commentaire non trouvé
 */
router.get('/:id', CommentController.getComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Mettre à jour un commentaire
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Nouveau contenu du commentaire
 *     responses:
 *       200:
 *         description: Commentaire mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé, authentification requise
 *       404:
 *         description: Commentaire non trouvé
 */
router.put('/:id', authMiddleware, CommentController.updateComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Supprimer un commentaire
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire à supprimer
 *     responses:
 *       200:
 *         description: Commentaire supprimé avec succès
 *       401:
 *         description: Non autorisé, authentification requise
 *       404:
 *         description: Commentaire non trouvé
 */
router.delete('/:id', authMiddleware, CommentController.deleteComment);

export default router;
