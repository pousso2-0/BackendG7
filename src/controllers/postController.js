// src/controllers/postController.js
import PostService from '../services/postService.js';

class PostController {
    static async createPost(req, res) {
        console.log("Creating post for user:", req.userId);
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(400).json({ message: "User ID is missing" });
            }
            const post = await PostService.createPost(userId, req.body);
            res.status(201).json(post);
        } catch (error) {
            console.error("Error creating post:", error);
            res.status(400).json({ message: error.message });
        }
    }

  static async getPost(req, res) {
    try {
      const post = await PostService.getPostById(req.params.id);
      res.json(post);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  static async updatePost(req, res) {
    try {
      const userId = req.user.id;
      const updatedPost = await PostService.updatePost(req.params.id, userId, req.body);
      res.json(updatedPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deletePost(req, res) {
    try {
      const userId = req.user.id;
      await PostService.deletePost(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async toggleComments(req, res) {
    try {
      const userId = req.user.id;
      const updatedPost = await PostService.toggleComments(req.params.id, userId);
      res.json(updatedPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getUserPosts(req, res) {
    try {
      const userId = req.params.userId || req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const posts = await PostService.getUserPosts(userId, page, limit);
      res.json(posts);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllPosts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const posts = await PostService.getAllPosts(page, limit);
      res.json(posts);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

}

export default PostController;