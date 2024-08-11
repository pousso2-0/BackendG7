// src/routes/postRoutes.js
import express from 'express';
import FeedController from '../controllers/feedController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();

// Route pour récupérer le fil d'actualité complet
router.get('/', authMiddleware ,FeedController.getUserFeed);

// Route pour récupérer uniquement les posts et partages des utilisateurs suivis
router.get('/follow',authMiddleware, (req, res) => {
    req.query.followingOnly = 'true';  // Marquer la requête comme "following only"
    FeedController.getUserFeed(req, res);  // Appeler la même méthode du contrôleur
});

export default router;
