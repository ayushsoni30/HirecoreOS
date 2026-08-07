/**
 * File: server/models/User.js
 * Description: Mongoose model for User profile containing developer identification,
 *              linked accounts (local, google), provider metadata, academic course details,
 *              profile picture URL, and subscription tier.
 */

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: false
  },
  accounts: {
    type: [{
      type: String,
      enum: ['local', 'google']
    }],
    default: ['local']
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  providerId: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profilePic: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
  },
  course: {
    type: String,
    required: true,
    enum: ['B.Tech', 'B.A.', 'B.C.A.', 'B.Com', 'B.Sc', 'M.C.A.', 'M.Tech', 'M.Sc', 'Other'],
    default: 'B.Tech'
  },
  tier: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
