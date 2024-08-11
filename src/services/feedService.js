// src/services/postService.js
import Post from '../models/Post.js';
import Share from '../models/Retweet.js';
import Follow from '../models/Follow.js';

class FeedService {
  // Méthode pour récupérer les posts et partages du fil d'actualité
  static async getUserFeed(userId, page, limit, followingOnly = false) {

    // console.log(userId, page, limit, followingOnly);

    const skip = (page - 1) * limit;

    let usersToInclude = []; // Initialise avec une liste vide

    if (followingOnly) {
      // Récupérer les utilisateurs que l'utilisateur suit
      const follows = await Follow.find({ follower: userId }).populate('followee');
      console.log("follows",follows);
      usersToInclude = follows.map(follow => follow.followee._id);
    }

    // Exclure l'utilisateur connecté des résultats de posts
    // On ajoute l'utilisateur connecté uniquement si on ne filtre pas par suivis seulement
    let queryParams = {};

    if (usersToInclude.length > 0) {
        queryParams = { ...queryParams, userId: { $in: [...usersToInclude, userId] } };
    }


    // Récupérer les posts des utilisateurs suivis
    const posts = await Post.find(queryParams)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });


    // Récupérer les partages des utilisateurs suivis
    const shares = await Share.find({ userId: { $in: usersToInclude } })
      .skip(skip)
      .limit(limit)
      .populate('postId') 
      .sort({ createdAt: -1 });

    // Combiner et trier les posts et partages par date
    const feed = [...posts, ...shares].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return feed;
  }
}

export default FeedService;
