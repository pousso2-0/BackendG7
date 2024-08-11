import VoteService from '../services/voteService.js';

class VoteController {
  static async vote(req, res) {
    try {
      const userId = req.userId;
      const { tailorId, rating } = req.body;

      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const vote = await VoteService.voteForTailor(userId, tailorId, rating);
      res.status(201).json({ message: 'Vote recorded successfully', vote });
    } catch (error) {
      res.status(400).json({ message: `Failed to vote: ${error.message}` });
    }
  }

  static async getTailorRating(req, res) {
    try {
      const tailorId = req.params.id;

      const rating = await VoteService.getTailorRating(tailorId);
      res.status(200).json(rating);
    } catch (error) {
      res.status(400).json({ message: `Failed to get rating: ${error.message}` });
    }
  }
}

export default VoteController;
