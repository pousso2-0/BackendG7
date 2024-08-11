import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  conversationId: { type: String, required: true }
}, { timestamps: true });

messageSchema.statics.createConversationId = function(user1Id, user2Id) {
  return [user1Id, user2Id].sort().join('_');
};

messageSchema.statics.findById = function(id) {
  return this.findOne({ _id: id });
};

messageSchema.statics.findBySenderAndReceiver = function(senderId, receiverId) {
  return this.find({ senderId, receiverId });
};

messageSchema.statics.createMessage = function(messageData) {
  const message = new this(messageData);
  return message.save();
};

messageSchema.statics.updateMessage = function(id, updateData) {
  return this.findByIdAndUpdate(id, updateData, { new: true });
};

messageSchema.statics.deleteMessage = function(id) {
  return this.findByIdAndDelete(id);
};

messageSchema.statics.findAll = function() {
  return this.find({});
};

const Message = mongoose.model('Message', messageSchema);

export default Message;