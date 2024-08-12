import express from 'express';
import UserController from '../controllers/userController.js';
import followController from '../controllers/followController.js';
import VoteController from '../controllers/voteController.js';
import reportController from '../controllers/reportController.js';
import NotificationController from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/register', UserController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants incorrects
 */
router.post('/login', UserController.login);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post('/logout', UserController.logout);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Mise à jour des informations de l'utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Informations mises à jour
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/:id', authMiddleware, UserController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Suppression d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/:id', authMiddleware, UserController.deleteUser);

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get('/', authMiddleware, UserController.getAllUsers);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur
 */
router.get('/profile', authMiddleware, UserController.getCurrentUserProfile);

/**
 * @swagger
 * /api/users/profile/{id}:
 *   get:
 *     summary: Récupérer le profil d'un utilisateur par ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/profile/:id', authMiddleware, UserController.getUserProfileById);

/**
 * @swagger
 * /api/users/report:
 *   post:
 *     summary: Signaler un utilisateur
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportedUserId:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signalement créé
 */
router.post('/report', authMiddleware, reportController.reportUser);

/**
 * @swagger
 * /api/users/follow:
 *   post:
 *     summary: Suivre un utilisateur
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               followedUserId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur suivi
 */
router.post('/follow', authMiddleware, followController.followUser);

/**
 * @swagger
 * /api/users/unfollow:
 *   delete:
 *     summary: Ne plus suivre un utilisateur
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unfollowedUserId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur non suivi
 */
router.delete('/unfollow', authMiddleware, followController.unfollowUser);

/**
 * @swagger
 * /api/users/follower:
 *   get:
 *     summary: Récupérer les abonnés de l'utilisateur connecté
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des abonnés
 */
router.get('/follower', authMiddleware, followController.getFollowers);

/**
 * @swagger
 * /api/users/following:
 *   get:
 *     summary: Récupérer les utilisateurs que l'utilisateur connecté suit
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs suivis
 */
router.get('/following', authMiddleware, followController.getFollowing);

/**
 * @swagger
 * /api/users/vote:
 *   post:
 *     summary: Voter pour un tailleur
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tailorId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Vote enregistré
 */
router.post('/vote', authMiddleware, VoteController.vote);

/**
 * @swagger
 * /api/users/{id}/vote:
 *   get:
 *     summary: Récupérer la note moyenne d'un tailleur
 *     tags: [Votes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du tailleur
 *     responses:
 *       200:
 *         description: Note moyenne récupérée
 */
router.get('/:id/vote', VoteController.getTailorRating);

/**
 * @swagger
 * /api/users/notifications:
 *   get:
 *     summary: Récupérer les notifications de l'utilisateur connecté
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des notifications
 */
router.get('/notifications', authMiddleware, NotificationController.getNotifications);

/**
 * @swagger
 * /api/users/notifications/{id}:
 *   patch:
 *     summary: Marquer une notification comme lue
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la notification
 *     responses:
 *       200:
 *         description: Notification marquée comme lue
 */
router.patch('/notifications/:id', authMiddleware, NotificationController.markAsRead);

/**
 * @swagger
 * /api/users/notifications:
 *   post:
 *     summary: Envoyer une notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification envoyée
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Utilisateur ou notification non trouvé
 */
router.post('/notifications', authMiddleware, NotificationController.sendNotification);

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Rechercher des utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Terme de recherche
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 *       404:
 *         description: Aucun utilisateur trouvé
 */
router.get('/search', authMiddleware, UserController.searchUsers);

export default router;
