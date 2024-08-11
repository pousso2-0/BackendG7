import mongoose from 'mongoose';

const ReactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reactionType: { type: String, enum: ['like', 'dislike', 'haha', 'coeur'], required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: false },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false }
}, { timestamps: true });

// Créez un index unique pour chaque utilisateur et réaction de type avec un post ou un commentaire, mais pas les deux
ReactionSchema.index({ user: 1, reactionType: 1, post: 1, comment: 1 }, { unique: true, partialFilterExpression: { $or: [{ post: { $exists: true } }, { comment: { $exists: true } }] } });

const Reaction = mongoose.model('Reaction', ReactionSchema);

export default Reaction;
