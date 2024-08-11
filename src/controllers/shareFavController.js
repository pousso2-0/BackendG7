// src/controllers/shareFavController.js
import SharFavService from '../services/shareFavService.js';

class shareFavController {
  static async sharePost(req, res) {
    try {
      const userId = req.userId;
      const { postId, content } = req.body;
      console.log("postId", postId, "content", content);

      const share = await SharFavService.sharePost(userId, postId, content);

      res.status(201).json({ message: 'Post shared successfully', share });
    } catch (error) {
      res.status(400).json({ message: `Failed to share post: ${error.message}` });
    }
  }

  static async addToFavorites(req, res) {
    try {
      const userId = req.userId;
      const { postId } = req.body;
      console.log("postId", postId);

      const favorite = await SharFavService.addToFavorites(userId, postId);

      res.status(201).json({ message: 'Post added to favorites successfully', favorite });
    } catch (error) {
      res.status(400).json({ message: `Failed to add post to favorites: ${error.message}` });
    }
  }

  static async getUserShares(req, res) {

    try {
      const userId = req.userId;

      const shares = await SharFavService.getUserShares(userId);

      res.status(200).json(shares);
    } catch (error) {
      res.status(400).json({ message: `Failed to get user shares: ${error.message}` });
    }
  }

  static async getUserFavorites(req, res) {
    try {
      const userId = req.userId;

      const favorites = await SharFavService.getUserFavorites(userId);

      res.status(200).json(favorites);
    } catch (error) {
      console.log("Error in getUserFavorites:", error.message);
      res.status(400).json({ message: `Failed to get user favorites: ${error.message}` });
    }
  }

  static async deleteFromFavorites(req, res) {
    try {
      const userId = req.userId;
      const { postId } = req.params;

      const result = await SharFavService.deleteFromFavorites(userId, postId);

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Post not found in favorites' });
      }

      res.status(204).json({ message: 'Post deleted from favorites successfully' });
    } catch (error) {
      res.status(400).json({ message: `Failed to delete post from favorites: ${error.message}` });
    }
  }
}

export default shareFavController;
