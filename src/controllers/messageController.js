import MessageService from '../services/messageService.js';

class MessageController {
    static async sendMessage(req, res) {
        try {
          const senderId = req.userId; 
          const { receiverId, content } = req.body;
          console.log("Sending message from:", senderId, "to:", receiverId);
          console.log("Message content:", content);
          const message = await MessageService.sendMessage(senderId, receiverId, content);
          console.log("Created message:", message);
          res.status(201).json(message);
        } catch (error) {
          console.error("Error sending message:", error);
          res.status(400).json({ message: error.message });
        }
      }
      static async getAllUserMessages(req, res) {
        try {
            const userId = req.userId;
            const messages = await MessageService.getAllUserMessages(userId);
            res.status(200).json(messages);
        } catch (error) {
            console.error("Error getting all user messages:", error);
            res.status(400).json({ message: error.message });
        }
    }

    static async getConversations(req, res) {
        try {
            const userId = req.userId;
            const conversations = await MessageService.getConversations(userId);
            res.status(200).json(conversations);
        } catch (error) {
            console.error("Error getting conversations:", error);
            res.status(400).json({ message: error.message });
        }
    }

    static async deleteMessage(req, res) {
        try {
            const userId = req.userId;
            const { id } = req.params;
            console.log("Deleting message:", id, "by user:", userId);
            
            await MessageService.deleteMessage(id, userId);
            res.status(200).json({ message: 'Message supprimé avec succès' });
        } catch (error) {
            console.error("Error deleting message:", error);
            res.status(400).json({ message: error.message });
        }
    }

    static async getMessagesWithUser(req, res) {
        try {
            const userId = req.userId;
            const { otherUserId } = req.params;
            const messages = await MessageService.getMessagesBetweenUsers(userId, otherUserId);
            res.status(200).json(messages);
        } catch (error) {
            console.error("Error getting messages with user:", error);
            res.status(400).json({ message: error.message });
        }
    }

}

export default MessageController;