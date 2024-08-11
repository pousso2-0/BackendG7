// src/models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    media: [
      {
        type: {
          type: String,
          enum: ["photo", "video"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    reactionCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    commentsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


// Ajout de méthodes statiques pour faciliter les opérations courantes
postSchema.statics.findById = function (id) {
  return this.findOne({ _id: id });
};

postSchema.statics.findByUserId = function (userId) {
  return this.find({ userId });
};

postSchema.statics.update = function (id, updateData) {
  return this.findByIdAndUpdate(id, updateData, { new: true });
};

postSchema.statics.delete = function (id) {
  return this.findByIdAndDelete(id);
};

const Post = mongoose.model("Post", postSchema);

export default Post;
