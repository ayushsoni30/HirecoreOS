/**
 * File: server/models/AnalysisResult.js
 * Description: Mongoose model to store all evaluation results (Resume Analysis, Tech Practice, Resume Interviews).
 */

const mongoose = require('mongoose');

const AnalysisResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['resume-analyzer', 'resume-interview', 'tech-interview'],
    required: true
  },
  technology: {
    type: String,
    default: null
  },
  score: {
    type: Number,
    required: true
  },
  pros: {
    type: [String],
    default: []
  },
  cons: {
    type: [String],
    default: []
  },
  feedback: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AnalysisResult', AnalysisResultSchema);
