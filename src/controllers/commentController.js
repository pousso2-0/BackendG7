import CommentService from '../services/commentService.js';

class CommentController {
    static async createComment(req, res) {
        try {
            console.log("Creating comment for post:", req.params.postId);
            console.log("User ID:", req.user.id);
            console.log("Comment content:", req.body.content);
            
            const comment = await CommentService.createComment(req.user.id, req.params.postId, req.body.content);
            console.log("Created comment:", comment);
            res.status(201).json(comment);
        } catch (error) {
            console.error("Error creating comment:", error);
            if (error.message === 'Comments are disabled for this post') {
                res.status(403).json({ message: error.message });
            } else {
                res.status(400).json({ message: error.message });
            }
        }
    }

    static async getComment(req, res) {
        try {
            const comment = await CommentService.getCommentById(req.params.id);
            res.json(comment);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    static async updateComment(req, res) {
        try {
            const updatedComment = await CommentService.updateComment(req.params.id, req.user.id, req.body);
            res.json(updatedComment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async deleteComment(req, res) {
        try {
            await CommentService.deleteComment(req.params.id, req.user.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getPostComments(req, res) {
        try {
            const comments = await CommentService.getCommentsByPostId(req.params.postId);
            res.json(comments);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default CommentController;
