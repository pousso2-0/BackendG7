import View from '../models/View.js';
import Post from '../models/Post.js';


class ViewPostController {
  static async recordView(req, res) {
    try {
      const postId = req.body.postId;
      const userId = req.userId;

      // Vérifiez si l'utilisateur a déjà vu le post
      const existView = await View.findOne({ user_id: userId, post_id: postId });
        
        if(existView) {
            return res.status(200).json({ message: 'Post déjà vu', view: existView});
        }

        //On va créer une nouvelle vue
        const view = new View ({
            user_id: userId,
            post_id: postId
        });

        await view.save();

        //On incrémente la vue du post
        const post =  await Post.findById(postId);
        post.viewsCount += 1;
        await post.save();

        res.status(201).json({ message: 'Vue enregistrée', view, viewsCount: post.viewsCount });

    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
        }
  }
}

export default ViewPostController;