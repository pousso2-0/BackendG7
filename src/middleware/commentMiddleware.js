// src/middleware/commentMiddleware.js
import Post from '../models/Post.js';

export const checkCommentsEnabled = async (req, res, next) => {
    try {
        console.log("Checking post ID:", req.params.postId);
        const post = await Post.findById(req.params.postId);
        console.log("Found post:", post);
        
        if (!post) {
            console.log("Post not found");
            return res.status(404).json({ message: 'Post not found' });
        }
        
        if (!post.commentsEnabled) {
            console.log("Comments are disabled for this post");
            return res.status(403).json({ message: 'Comments are disabled for this post' });
        }
        
        console.log("Comments are enabled, proceeding to next middleware");
        next();
    } catch (error) {
        console.error('Comment verification error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
