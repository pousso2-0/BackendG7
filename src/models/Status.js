// src/models/Status.js
import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
    },
    media: {
        type: {
            type: String,
            enum: ["photo", "video"],
        },
        url: {
            type: String,
        },
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    viewedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes par défaut
    },
});

const Status = mongoose.model("Status", statusSchema);
export default Status;
