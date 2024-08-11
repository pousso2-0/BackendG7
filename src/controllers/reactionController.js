// src/controllers/reactionController.js
import ReactionService from '../services/reactionService.js';

class ReactionController {
  // Ajouter ou supprimer une réaction
  static async toggleReaction(req, res) {
    const { postId, commentId, reactionType } = req.body;
    const userId = req.userId; // Assurez-vous que l'utilisateur est authentifié

    try {
      if (!reactionType || (!postId && !commentId) || (postId && commentId)) {
        return res.status(400).json({ message: 'Invalid request' });
      }

      const result = await ReactionService.toggleReaction(userId, { reactionType, postId, commentId });
      res.status(result.removed ? 204 : 200).json(result);
    } catch (error) {
      res.status(400).json({ message: `Failed to toggle reaction: ${error.message}` });
    }
  }

  // Récupérer toutes les réactions pour un post
  static async getReactionsForPost(req, res) {
    const { postId } = req.params;

    try {
      const reactions = await ReactionService.getReactionsForPost(postId);
      res.json(reactions);
    } catch (error) {
      res.status(400).json({ message: `Failed to get reactions for post: ${error.message}` });
    }
  }

  // Récupérer toutes les réactions pour un commentaire
  static async getReactionsForComment(req, res) {
    const { commentId } = req.params;

    try {
      const reactions = await ReactionService.getReactionsForComment(commentId);
      res.json(reactions);
    } catch (error) {
      res.status(400).json({ message: `Failed to get reactions for comment: ${error.message}` });
    }
  }
}

export default ReactionController;
