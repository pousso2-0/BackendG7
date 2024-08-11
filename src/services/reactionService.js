// src/services/reactionService.js
import Reaction from '../models/Reaction.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

class ReactionService {
  // Méthode pour ajouter ou supprimer une réaction
  static async toggleReaction(userId, { reactionType, postId, commentId }) {
    if ((postId && commentId) || (!postId && !commentId)) {
      throw new Error('You must provide either postId or commentId, but not both.');
    }

    const filter = {
      user: userId,
      $or: [
        { post: postId || null },
        { comment: commentId || null }
      ]
    };

    const reaction = await Reaction.findOne(filter);

    if (reaction) {
      if (reaction.reactionType === reactionType) {
        await Reaction.deleteOne({ _id: reaction._id });
        await this.updateReactionCount(postId, commentId, -1);
        return { removed: true };
      } else {
        await Reaction.updateOne({ _id: reaction._id }, { $set: { reactionType } });
        await this.updateReactionCount(postId, commentId, 0);
        return { updated: true, reaction };
      }
    } else {
      const newReaction = await Reaction.create({
        user: userId,
        reactionType,
        post: postId || undefined,
        comment: commentId || undefined
      });
      await this.updateReactionCount(postId, commentId, 1);
      return { created: true, reaction: newReaction };
    }
  }

  // Méthode pour récupérer les réactions pour un post
  static async getReactionsForPost(postId) {
    const react = Reaction.find({ post: postId });
    console.log(react);
    return react.sort({ createdAt: -1 });
  }

  // Méthode pour récupérer les réactions pour un commentaire
  static async getReactionsForComment(commentId) {
    return Reaction.find({ comment: commentId });
  }

  static async updateReactionCount(postId, commentId, increment) {
    if (postId) {
        console.log(postId + ' updated', commentId);
      await Post.findByIdAndUpdate(postId, { $inc: { reactionCount: increment } });
    }

    if (commentId) {
        console.log(commentId + ' updated', postId );

      await Comment.findByIdAndUpdate(commentId, { $inc: { reactionCount: increment } });
    }
  }
}

export default ReactionService;
