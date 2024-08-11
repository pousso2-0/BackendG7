

import FeedService from "../services/feedService.js";

class FeedController {
    // Méthode pour récupérer le fil d'actualité
    static async getUserFeed(req, res) {
      try {
        const userId = req.userId; // L'utilisateur connecté
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const followingOnly = req.query.followingOnly === 'true'; // Vérifie si on doit filtrer par suivi
  
        const feed = await FeedService.getUserFeed(userId, page, limit, followingOnly);
        res.json(feed);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
  
  export default FeedController;
  