import mongoose from 'mongoose';

const shareSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, default: '' }
  },
  { timestamps: true }
);

const Retweet = mongoose.model('Retweet', shareSchema);

export default Retweet;
