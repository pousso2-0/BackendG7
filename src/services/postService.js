// src/services/postService.js
import Post from "../models/Post.js";
import User from "../models/User.js";
import { ValidationError, DatabaseError } from "../errors/customErrors.js";

class PostService {
  static async createPost(userId, postData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ValidationError("User not found");
      }

      const newPost = await Post.create({
        userId,
        ...postData
      });

      // Mettre à jour le nombre de posts de l'utilisateur
      await User.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } });

      return newPost;
    } catch (error) {
      throw new DatabaseError(`Failed to create post: ${error.message}`);
    }
  }

  static async getPostById(postId) {
    try {
      const post = await Post.findById(postId).populate('userId', 'name profilePicture');
      if (!post) {
        throw new ValidationError("Post not found");
      }
      return post;
    } catch (error) {
      throw new DatabaseError(`Failed to get post: ${error.message}`);
    }
  }

  static async updatePost(postId, userId, updateData) {
    try {
      const post = await Post.findOne({ _id: postId, userId });
      if (!post) {
        throw new ValidationError("Post not found or you're not authorized to update it");
      }

      Object.assign(post, updateData);
      post.updatedAt = Date.now();
      await post.save();

      return post;
    } catch (error) {
      throw new DatabaseError(`Failed to update post: ${error.message}`);
    }
  }

  static async deletePost(postId, userId) {
    try {
      const post = await Post.findOneAndDelete({ _id: postId, userId });
      if (!post) {
        throw new ValidationError("Post not found or you're not authorized to delete it");
      }

      // Mettre à jour le nombre de posts de l'utilisateur
      await User.findByIdAndUpdate(userId, { $inc: { postsCount: -1 } });

      return post;
    } catch (error) {
      throw new DatabaseError(`Failed to delete post: ${error.message}`);
    }
  }

  static async getUserPosts(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const posts = await Post.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name profilePicture');

      return posts;
    } catch (error) {
      throw new DatabaseError(`Failed to get user posts: ${error.message}`);
    }
  }

  static async incrementShareCount(postId) {
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $inc: { sharesCount: 1 } },
        { new: true }
      );
      if (!updatedPost) {
        throw new ValidationError("Post not found");
      }
      return updatedPost;
    } catch (error) {
      throw new DatabaseError(`Failed to increment share count: ${error.message}`);
    }
  }

  static async getAllPosts(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name profilePicture');

      return posts;
    } catch (error) {
      throw new DatabaseError(`Failed to get all posts: ${error.message}`);
    }
  }
}



export default PostService;