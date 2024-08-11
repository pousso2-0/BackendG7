import mongoose from 'mongoose';

const validReasons = ['spam', 'harassment', 'hate speech', 'fake profile', 'other'];

const reportSchema = new mongoose.Schema({
  signaled: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  signaler: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reasons: [{ type: String, enum: validReasons, required: true }]
}, { timestamps: true });

// Ensure uniqueness of report between two users
reportSchema.index({ signaled: 1, signaler: 1 }, { unique: true });


const Report = mongoose.model('Report', reportSchema);

export default Report;
