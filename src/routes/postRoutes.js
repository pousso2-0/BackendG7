// src/routes/postRoutes.js
import express from 'express';
import PostController from '../controllers/postController.js';
import shareFavController from '../controllers/shareFavController.js';
import ViewPostController from '../controllers/viewpostController.js';
import ShareController from '../controllers/shareController.js';


import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

import { ObjectId } from 'mongodb';

const router = express.Router();


// Middleware pour vérifier si l'utilisateur est un tailleur
const isTailor = roleMiddleware(['tailleur']); 

// Créer un nouveau post (uniquement pour les tailleurs)
router.post('/', authMiddleware, isTailor, PostController.createPost);

// Obtenir tous les posts (accessible à tous)
router.get('/', PostController.getAllPosts);

// Obtenir un post spécifique par son ID (accessible à tous)
router.get('/:id', (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid post ID format" });
  }
  PostController.getPost(req, res, next);
});

// Mettre à jour un post (uniquement pour les tailleurs)
router.put('/:id', authMiddleware, isTailor, (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid post ID format" });
  }
  PostController.updatePost(req, res, next);
});

// Supprimer un post (uniquement pour les tailleurs)
router.delete('/:id', authMiddleware, isTailor, (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid post ID format" });
  }
  PostController.deletePost(req, res, next);
});

// Obtenir tous les posts d'un utilisateur spécifique (accessible à tous)
router.get('/user/:userId', (req, res, next) => {
  if (!ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }
  PostController.getUserPosts(req, res, next);
});

router.post('/retweet',authMiddleware, shareFavController.sharePost);          // Partager un post
router.post('/favories',authMiddleware, shareFavController.addToFavorites); // Ajouter un post aux favoris
router.get('/retweets', authMiddleware, shareFavController.getUserShares);      // Obtenir les posts partagés par l'utilisateur
router.get('/favorites', authMiddleware, shareFavController.getUserFavorites); // Obtenir les posts favoris de l'utilisateur
router.post('/test', authMiddleware, ShareController.testEndpoint);
router.post('/share', authMiddleware, ShareController.sharePost);
router.delete('/favorites/:id', authMiddleware, shareFavController.deleteFromFavorites); // Supprimer un post des favoris
router.post('/view', authMiddleware, ViewPostController.recordView)





export default router;