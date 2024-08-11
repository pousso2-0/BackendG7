// src/services/postService.js
import Retweet from "../models/Retweet.js";
import Favorite from "../models/Favorite.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { ValidationError, DatabaseError } from "../errors/customErrors.js";

class SharFavService {
  // Méthode pour partager un post
  static async sharePost(userId, postId, content) {
    const post = await Post.findById(postId);
    
    if (!post) throw new Error("Post not found");

    const existingShare = await Retweet.findOne({ userId, postId });
    if (existingShare) throw new Error("Post already shared by this user");

    const newShare = await Retweet.create({ userId, postId, content });

    await Post.findByIdAndUpdate(postId, { $inc: { sharesCount: 1 } });


    return newShare;
  }

  // Méthode pour ajouter un post aux favoris
  static async addToFavorites(userId, postId) {
    console.log("Share post");
    console.log(userId, postId);

    const post = await Post.findById(postId);
    console.log("azerty",post);

    if (!post) throw new Error("Post not found");

    const existingFavorite = await Favorite.findOne({ userId, postId });
    if (existingFavorite) throw new Error("Post already in favorites");

    const newFavorite = await Favorite.create({ userId, postId });

    return newFavorite;
  }
  // Méthode pour supprimer un post des favoris
  static async deleteFromFavorites(userId, postId) {
    const favorite = await Favorite.findOneAndDelete({ userId, postId });

    if (!favorite) throw new Error("Post not found in favorites");

    await Post.findByIdAndUpdate(postId, { $inc: { favoritesCount: -1 } });

    return favorite;
  }
  // Méthode pour obtenir les posts partagés par un utilisateur
  static async getUserShares(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    return await Retweet.find({ userId }).populate('postId').populate('userId');
  }

  // Méthode pour obtenir les posts favoris d'un utilisateur
  static async getUserFavorites(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    return await Favorite.find({ userId }).populate('postId').populate('userId');
  }

}

export default SharFavService;
