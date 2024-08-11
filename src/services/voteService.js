import mongoose from 'mongoose';
import Vote from '../models/Vote.js';
import User from '../models/User.js';

class VoteService {
  static async voteForTailor(userId, tailorId, rating) {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(tailorId)) {
      throw new Error('Invalid ObjectId');
    }

    const tailor = await User.findById(tailorId);
    if (!tailor || !tailor.isTailor) {
      throw new Error('You can only vote for tailors');
    }

    const vote = await Vote.create({ userId, tailorId, rating });
    return vote;
  }

  static async getTailorRating(tailorId) {
    if (!mongoose.Types.ObjectId.isValid(tailorId)) {
      throw new Error('Invalid ObjectId');
    }

    const votes = await Vote.find({ tailorId });
    const totalVotes = votes.length;
    const totalRating = votes.reduce((sum, vote) => sum + vote.rating, 0);
    const averageRating = totalVotes > 0 ? totalRating / totalVotes : 0;

    return { averageRating, totalVotes };
  }
}

export default VoteService;
