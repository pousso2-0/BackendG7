import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

class CommentService {
    static async createComment(userId, postId, content) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        if (!post.commentsEnabled) {
            throw new Error('Comments are disabled for this post');
        }
        const newComment = await Comment.create({
            userId,
            postId,
            content
        });
        // Incrémente le nombre de commentaires du post
        await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
        return newComment;
    }

    static async getCommentById(id) {
        const comment = Comment.findById(id);
        if (!comment) {
            throw new Error('Comment not found');
        }
        return comment;
    }

    static async updateComment(id, userId, updateData) {
        const comment = Comment.findById(id);
        if (!comment) {
            throw new Error('Comment not found');
        }
        if (comment.userId !== userId) {
            throw new Error('Unauthorized');
        }
        const updatedComment = Comment.update(id, updateData);
        return updatedComment;
    }

    static async deleteComment(id, userId) {
        const comment = Comment.findById(id);
        if (!comment) {
            throw new Error('Comment not found');
        }
        if (comment.userId !== userId) {
            throw new Error('Unauthorized');
        }
        const deletedComment = Comment.delete(id);
        return deletedComment;
    }

    static async getCommentsByPostId(postId) {
        return Comment.findByPostId(postId);
    }
}

export default CommentService;
