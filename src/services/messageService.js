import Message from '../models/Message.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

class MessageService {
    static async sendMessage(senderId, receiverId, content) {
        const sender = await User.findById(senderId);
        if (!sender) {
            throw new Error('Sender not found');
        }
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            throw new Error('Receiver not found');
        }
        const conversationId = Message.createConversationId(senderId, receiverId);
        const newMessage = await Message.createMessage({
            senderId,
            receiverId,
            content,
            conversationId
        });
        return newMessage;
    }

    static async getMessagesBetweenUsers(userId, otherUserId) {
        return Message.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });
    }

    static async deleteMessage(id, userId) {
        const message = await Message.findById(id);
        if (!message) {
            throw new Error('Message not found');
        }
        if (message.senderId.toString() !== userId) {
            throw new Error('Unauthorized');
        }
        return Message.deleteMessage(id);
    }
    static async getConversations(userId) {
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: new mongoose.Types.ObjectId(userId) },
                        { receiverId: new mongoose.Types.ObjectId(userId) }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: '$conversationId',
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [
                                    { $eq: ['$receiverId', new mongoose.Types.ObjectId(userId)] },
                                    { $eq: ['$isRead', false] }
                                ]},
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: '$lastMessage._id',
                    conversationId: '$_id',
                    senderId: '$lastMessage.senderId',
                    receiverId: '$lastMessage.receiverId',
                    content: '$lastMessage.content',
                    createdAt: '$lastMessage.createdAt',
                    unreadCount: 1
                }
            }
        ]);

        return conversations;
    }

    static async getAllUserMessages(userId) {
        return Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).sort({ createdAt: -1 });
    }
}

export default MessageService;