import mongoose from 'mongoose';

const viewSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }
},{ timestamps: true });

const View = mongoose.model('View', viewSchema);

export default View;