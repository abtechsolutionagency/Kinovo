import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: function () {
        const seed = encodeURIComponent(this.name || 'user');
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
      },
    },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    trustScore: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'lite', 'premium'],
      default: 'free',
    },
    subscriptionStatus: {
      type: String,
      enum: ['none', 'active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete'],
      default: 'none',
    },
    stripeCustomerId: { type: String, default: null, index: true, sparse: true },
    stripeSubscriptionId: { type: String, default: null, sparse: true },
    anonymousBrowsing: { type: Boolean, default: false },
    profileBoostedUntil: { type: Date, default: null },
    privateGallery: { type: [String], default: [] },
    preferredLanguage: { type: String, default: 'en' },
    languages: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    travelPreferences: {
      budget: { type: String, default: '' },
      travelStyle: { type: String, default: '' },
      accommodation: { type: String, default: '' },
      tripDuration: { type: String, default: '' },
      nightlife: { type: Boolean, default: false },
      adventure: { type: Boolean, default: false },
      culture: { type: Boolean, default: false },
      beach: { type: Boolean, default: false },
    },
    inviteCodeUsed: { type: String },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },
    memberSince: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    email: this.email,
    name: this.name,
    avatar: this.avatar,
    bio: this.bio,
    location: this.location,
    verified: this.verified,
    trustScore: this.trustScore,
    isPremium: this.isPremium,
    subscriptionPlan: this.subscriptionPlan || 'free',
    subscriptionStatus: this.subscriptionStatus || 'none',
    anonymousBrowsing: Boolean(this.anonymousBrowsing),
    profileBoostedUntil: this.profileBoostedUntil,
    profileBoosted: this.profileBoostedUntil ? new Date(this.profileBoostedUntil) > new Date() : false,
    privateGallery: this.privateGallery || [],
    preferredLanguage: this.preferredLanguage || 'en',
    role: this.role,
    languages: this.languages,
    interests: this.interests,
    travelPreferences: this.travelPreferences || {},
    memberSince: this.memberSince?.toISOString?.()?.split('T')[0] || this.memberSince,
  };
};

userSchema.methods.toDiscoverJSON = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    avatar: this.avatar,
    bio: this.bio,
    location: this.location,
    verified: this.verified,
    trustScore: this.trustScore,
    isPremium: this.isPremium,
    isBoosted: this.profileBoostedUntil ? new Date(this.profileBoostedUntil) > new Date() : false,
    languages: this.languages,
    interests: this.interests,
    travelPreferences: this.travelPreferences || {},
    memberSince: this.memberSince?.toISOString?.()?.split('T')[0] || this.memberSince,
  };
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
