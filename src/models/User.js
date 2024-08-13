// src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  dateOfBirth: { type: Date },
  gender: { type: String, default: '' },
  phone: { type: String, default: '' },
  website: { type: String, default: '' },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  postsCount: { type: Number, default: 0 },
  credits: { type: Number, default: 30 },
  subscriptionType: { type: String, enum: ['free', 'premium'], default: 'free' },
  premiumExpiresAt: { type: Date },
  interests: [String],
  skills: [String],
  isPrivate: { type: Boolean, default: false },
  notificationsEnabled: { type: Boolean, default: true },
  reportCount: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});


userSchema.virtual('isTailor').get(function() {
  return this.type === 'tailleur';
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


userSchema.statics.findById = function(id) {œ
  return this.findOne({ _id: id });
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

userSchema.statics.findByPhone = function(phone) {
  return this.findOne({ phone });
};

userSchema.statics.update = function(id, updateData) {
  return this.findByIdAndUpdate(id, updateData, { new: true });
};

userSchema.statics.delete = function(id) {
  return this.findByIdAndDelete(id);
};

userSchema.statics.findAll = function() {
  return this.find({});
};

userSchema.statics.findByName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
};

const User = mongoose.model('User', userSchema);

export default User;