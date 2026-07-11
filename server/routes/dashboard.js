/**
 * File: server/routes/dashboard.js
 * Description: API endpoints to fetch recent activities and progress scores for the dashboard.
 */

const express = require('express');
const router = express.Router();
const { checkJwt, syncUser } = require('../middleware/auth');
const AnalysisResult = require('../models/AnalysisResult');

// GET /api/dashboard/summary - Retrieve latest score stats for all three tools
router.get('/summary', checkJwt, syncUser, async (req, res) => {
  try {
    const userId = req.mongoUser._id;

    // Fetch the single latest resume analysis result
    const lastResumeAnalysis = await AnalysisResult.findOne({
      userId,
      type: 'resume-analyzer'
    })
      .sort({ createdAt: -1 })
      .select('score createdAt');

    // Fetch the single latest technical practice interview result
    const lastTechInterview = await AnalysisResult.findOne({
      userId,
      type: 'tech-interview'
    })
      .sort({ createdAt: -1 })
      .select('score technology createdAt');

    // Fetch the single latest resume-based interview result
    const lastResumeInterview = await AnalysisResult.findOne({
      userId,
      type: 'resume-interview'
    })
      .sort({ createdAt: -1 })
      .select('score createdAt');

    res.json({
      success: true,
      resumeAnalysis: lastResumeAnalysis
        ? { score: lastResumeAnalysis.score, createdAt: lastResumeAnalysis.createdAt }
        : null,
      techInterview: lastTechInterview
        ? { score: lastTechInterview.score, technology: lastTechInterview.technology, createdAt: lastTechInterview.createdAt }
        : null,
      resumeInterview: lastResumeInterview
        ? { score: lastResumeInterview.score, createdAt: lastResumeInterview.createdAt }
        : null
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ message: 'Error fetching summary metrics.' });
  }
});

module.exports = router;
