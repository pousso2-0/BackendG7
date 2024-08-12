import express from 'express';
import PostController from '../controllers/postController.js';
import shareFavController from '../controllers/shareFavController.js';
import ViewPostController from '../controllers/viewpostController.js';
import ShareController from '../controllers/shareController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

const isTailor = roleMiddleware(['tailleur']);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Créer un nouveau post (uniquement pour les tailleurs)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Contenu du post
 *               media:
 *                 type: array
 *                 description: Contenu image ou video du post
 *               isPublic:
 *                 type: boolean
 *                 description: si le post est public ou privé
 *               commentsEnabled:
 *                 type: boolean
 *                 description: si les commentaire du post seront desactiver ou pas 
 *     responses:
 *       201:
 *         description: Post créé avec succès
 *       403:
 *         description: Accès interdit, seul les tailleurs peuvent créer un post
 *       400:
 *         description: Données invalides
 */
router.post('/', authMiddleware, isTailor, PostController.createPost);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Obtenir tous les posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Liste de tous les posts
 */
router.get('/', PostController.getAllPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Obtenir un post spécifique par son ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post à obtenir
 *     responses:
 *       200:
 *         description: Détails du post
 *       400:
 *         description: Format ID de post invalide
 *       404:
 *         description: Post non trouvé
 */
router.get('/:id', (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid post ID format" });
  }
  PostController.getPost(req, res, next);
});

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Mettre à jour un post (uniquement pour les tailleurs)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nouveau titre du post
 *               content:
 *                 type: string
 *                 description: Nouveau contenu du post
 *     responses:
 *       200:
 *         description: Post mis à jour avec succès
 *       403:
 *         description: Accès interdit, seul les tailleurs peuvent mettre à jour un post
 *       400:
 *         description: Format ID de post invalide ou données invalides
 *       404:
 *         description: Post non trouvé
 */
router.put('/:id', authMiddleware, isTailor, (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid post ID format" });
  }
  PostController.updatePost(req, res, next);
});

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Supprimer un post (uniquement pour les tailleurs)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post à supprimer
 *     responses:
 *       200:
 *         description: Post supprimé avec succès
 *       403:
 *         description: Accès interdit, seul les tailleurs peuvent supprimer un post
 *       400:
 *         description: Format ID de post invalide
 *       404:
 *         description: Post non trouvé
 */
router.delete('/:id', authMiddleware, isTailor, (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid post ID format" });
  }
  PostController.deletePost(req, res, next);
});

/**
 * @swagger
 * /api/posts/user/{userId}:
 *   get:
 *     summary: Obtenir tous les posts d'un utilisateur spécifique
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur dont récupérer les posts
 *     responses:
 *       200:
 *         description: Liste des posts de l'utilisateur
 *       400:
 *         description: Format ID d'utilisateur invalide
 *       404:
 *         description: Utilisateur non trouvé ou aucun post trouvé
 */
router.get('/user/:userId', (req, res, next) => {
  if (!ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }
  PostController.getUserPosts(req, res, next);
});

/**
 * @swagger
 * /api/posts/retweet:
 *   post:
 *     summary: Partager un post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID du post à partager
 *     responses:
 *       200:
 *         description: Post partagé avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Post non trouvé
 */
router.post('/retweet', authMiddleware, shareFavController.sharePost);

/**
 * @swagger
 * /api/posts/favorites:
 *   post:
 *     summary: Ajouter un post aux favoris
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID du post à ajouter aux favoris
 *     responses:
 *       200:
 *         description: Post ajouté aux favoris avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Post non trouvé
 */
router.post('/favorites', authMiddleware, shareFavController.addToFavorites);

/**
 * @swagger
 * /api/posts/retweets:
 *   get:
 *     summary: Obtenir les posts partagés par l'utilisateur
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des posts partagés par l'utilisateur
 *       404:
 *         description: Aucun post partagé trouvé
 */
router.get('/retweets', authMiddleware, shareFavController.getUserShares);

/**
 * @swagger
 * /api/posts/favorites/f:
 *   get:
 *     summary: Obtenir les posts favoris de l'utilisateur
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des posts favoris de l'utilisateur
 *       404:
 *         description: Aucun post favori trouvé
 */
router.get('/favorites/f', authMiddleware, shareFavController.getUserFavorites);

/**
 * @swagger
 * /api/posts/test:
 *   post:
 *     summary: Point de terminaison de test (démonstration)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               testData:
 *                 type: string
 *                 description: Données de test
 *     responses:
 *       200:
 *         description: Réponse de test réussie
 *       400:
 *         description: Données invalides
 */
router.post('/test', authMiddleware, ShareController.testEndpoint);

/**
 * @swagger
 * /api/posts/share:
 *   post:
 *     summary: Partager un post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID du post à partager
 *     responses:
 *       200:
 *         description: Post partagé avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Post non trouvé
 */
router.post('/share', authMiddleware, ShareController.sharePost);

/**
 * @swagger
 * /api/posts/favorites/{id}:
 *   delete:
 *     summary: Supprimer un post des favoris
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post à supprimer des favoris
 *     responses:
 *       200:
 *         description: Post supprimé des favoris avec succès
 *       400:
 *         description: Format ID de post invalide
 *       404:
 *         description: Post non trouvé dans les favoris
 */
router.delete('/favorites/:id', authMiddleware, shareFavController.deleteFromFavorites);

/**
 * @swagger
 * /api/posts/view:
 *   post:
 *     summary: Enregistrer la vue d'un post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID du post dont enregistrer la vue
 *     responses:
 *       200:
 *         description: Vue enregistrée avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Post non trouvé
 */
router.post('/view', authMiddleware, ViewPostController.recordView);

export default router;
