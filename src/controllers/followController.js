// src/controllers/FollowController.js
import FollowService from '../services/followService.js';

class followController {
  static async followUser(req, res) {
    try {
      const followerId = req.userId;
      const {followingId} = req.body;
      

      console.log("followerId", followerId, "followingId", followingId);

      const follow = await FollowService.followUser(followerId, followingId);


      res.status(201).json({ message: 'User followed successfully', follow });
    } catch (error) {
      res.status(400).json({ message: `Failed to follow user: ${error.message}` });
    }
  }

   static async unfollowUser(req, res) {
    try {
        const followerId = req.userId;
        const {followingId} = req.body;
        
      const unfollow = await FollowService.unfollowUser(followerId, followingId);

      res.status(200).json({ message: 'User unfollowed successfully', unfollow });
    } catch (error) {
      res.status(400).json({ message: `Failed to unfollow user: ${error.message}` });
    }
  }

  static async getFollowers(req, res) {
    try {
      const userId = req.userId;

      const followers = await FollowService.getFollowers(userId);
      res.status(200).json(followers);
    } catch (error) {
      res.status(400).json({ message: `Failed to get followers: ${error.message}` });
    }
  }

  static async getFollowing(req, res) {
    try {
      const userId = req.userId;

      const following = await FollowService.getFollowing(userId);
      res.status(200).json(following);
    } catch (error) {
      res.status(400).json({ message: `Failed to get following: ${error.message}` });
    }
  }
}

export default  followController;
