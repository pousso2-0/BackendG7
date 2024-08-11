import PostService from '../services/postService.js';
import MessageService from '../services/messageService.js';


class ShareController {
static async sharePost(req, res) {
    console.log("sharePost function called"); 
    try {
        const senderId = req.userId;
        const { postId, recipients } = req.body;
        
        console.log("Request body:", req.body);
        console.log("Sender ID:", senderId);

        // Vérifiez si le post existe
        const post = await PostService.getPostById(postId);
        if (!post) {
            console.log("Post not found for ID:", postId);
            return res.status(404).json({ message: "Post not found" });
        }

        console.log("Post found:", post);

        // Générez l'URL complète de la même manière que dans testEndpoint
        const fullUrl = `${req.protocol}://${req.get('host')}/api/posts/${postId}`;
        console.log("Generated Full URL:", fullUrl);

        const content = `Shared post: ${fullUrl}`;
        console.log("Generated Content:", content);

        console.log("Sharing post:");
        console.log("Post ID:", postId);
        console.log("Recipients:", recipients);

        const sharePromises = recipients.map(recipientId => {
            console.log("Sending message to recipient:", recipientId);
            return MessageService.sendMessage(senderId, recipientId, content);
        });

        const sharedMessages = await Promise.all(sharePromises);
        console.log("Shared Messages:", sharedMessages);

        const response = {
            message: "Post shared successfully",
            sharedMessages: sharedMessages.map(msg => ({
                messageId: msg._id,
                recipientId: msg.receiverId,
                content: msg.content
            })),
            fullUrl
        };

        console.log("Response being sent:", response);

        res.status(201).json(response);
    } catch (error) {
        console.error("Error sharing post:", error);
        res.status(400).json({ message: error.message });
    }
}

static async testEndpoint(req, res) {
  console.log("testEndpoint function called");
  try {
    const senderId = req.userId;
    const { postId, recipients } = req.body;
    
    console.log("Request body:", req.body);
    console.log("Sender ID:", senderId);

    // Vérifiez si le post existe
    const post = await PostService.getPostById(postId);
    if (!post) {
      console.log("Post not found for ID:", postId);
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Post found:", post);

    // Générez l'URL complète
    const fullUrl = `${req.protocol}://${req.get('host')}/api/posts/${postId}`;
    console.log("Generated Full URL:", fullUrl);

    console.log("Test Endpoint Data:");
    console.log("User ID:", senderId);
    console.log("Post ID:", postId);
    console.log("Recipients:", recipients);
    console.log("Full URL:", fullUrl);

    // Envoyer réellement les messages aux destinataires
    const messagePromises = recipients.map(recipientId => {
      console.log("Sending message to recipient:", recipientId);
      return MessageService.sendMessage(senderId, recipientId, fullUrl);
    });

    const sentMessages = await Promise.all(messagePromises);

    // Incrémenter le compteur de partages du post
    await PostService.incrementShareCount(postId);

    const response = {
      message: "Test endpoint executed successfully, messages sent",
      userId: senderId,
      fullUrl: fullUrl,
      sentMessages: sentMessages.map(msg => ({
        messageId: msg._id,
        recipientId: msg.receiverId,
        content: msg.content
      }))
    };

    console.log("Response being sent:", response);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in test endpoint:", error);
    res.status(400).json({ message: error.message });
  }
}

}

export default ShareController;