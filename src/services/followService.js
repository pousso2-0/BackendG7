// src/services/FollowService.js
import mongoose from 'mongoose';
import Follow from '../models/Follow.js';
import User from '../models/User.js';

class FollowService {
  static async followUser(userId, followId) {
    // Vérifiez que les IDs sont des ObjectId valides
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(followId)) {
      throw new Error('Invalid userId or followId');
    }

    // Créez un nouveau suivi
    const follow = await Follow.create({ follower: userId, followee: followId });

    // Mettez à jour les compteurs
    await User.findByIdAndUpdate(userId, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(followId, { $inc: { followersCount: 1 } });

    return follow;
  }

  static async unfollowUser(userId, followId) {
    // Vérifiez que les IDs sont des ObjectId valides
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(followId)) {
      throw new Error('Invalid userId or followId');
    }

    // Supprimez le suivi
    await Follow.findOneAndDelete({ follower: userId, followee: followId });

    // Mettez à jour les compteurs
    await User.findByIdAndUpdate(userId, { $inc: { followingCount: -1 } });
    await User.findByIdAndUpdate(followId, { $inc: { followersCount: -1 } });
  }
  

  static async getFollowers(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid userId');
    }
    const followers = await Follow.find({ followee: userId }).populate('follower', 'name');
    return followers.map(f => ({ id: f.follower._id, name: f.follower.name }));
  }

  static async getFollowing(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid userId');
    }
    const following = await Follow.find({ follower: userId }).populate('followee', 'name');
    return following.map(f => ({ id: f.followee._id, name: f.followee.name }));
  }
}

export default FollowService;
