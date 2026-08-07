/**
 * File: server/routes/resumeAnalyzer.js
 * Description: API endpoints for parsing, analyzing, and scoring resumes against a Job Description.
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const pdfParse = require('pdf-parse');
const upload = require('../middleware/upload');
const { checkJwt, syncUser } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { callCerebras } = require('../utils/cerebras');
const AnalysisResult = require('../models/AnalysisResult');

// POST /api/resume-analyzer - Upload resume PDF and match against job description
router.post('/', checkJwt, syncUser, aiLimiter, upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a resume PDF file.' });
  }

  const { jobDescription } = req.body;
  if (!jobDescription || jobDescription.trim() === '') {
    // Remove the file if uploaded but JD is missing
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ message: 'Job Description is required.' });
  }

  const filePath = req.file.path;

  try {
    // Read and parse PDF
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim() === '') {
      throw new Error('Could not extract text from the PDF file. It might be scanned or empty.');
    }

    // Call Cerebras GPT-OSS-120B
    const prompt = `You are a professional resume reviewer. Given the resume and job description below, return a JSON object with:
- score: number (0-100)
- pros: array of strings (max 5)
- cons: array of strings (max 5)

Resume:
${resumeText}

Job Description:
${jobDescription}

Return only valid JSON, no explanation.`;

    const result = await callCerebras(prompt, true);

    const score = result && result.score !== undefined ? result.score : (result?.matchScore || result?.overallScore || 0);
    const pros = result ? (result.pros || result.strengths || []) : [];
    const cons = result ? (result.cons || result.weaknesses || []) : [];

    // Save to Database
    const analysis = new AnalysisResult({
      userId: req.mongoUser._id,
      type: 'resume-analyzer',
      score: score,
      pros: pros,
      cons: cons,
      feedback: {
        jobDescription: jobDescription.substring(0, 1000) // Store slice of JD in feedback metadata
      }
    });

    await analysis.save();

    res.json({
      success: true,
      analysisId: analysis._id,
      score: analysis.score,
      pros: analysis.pros,
      cons: analysis.cons
    });

  } catch (error) {
    console.error('Error in resume analysis route:', error);
    res.status(500).json({ message: error.message || 'Error occurred during resume analysis.' });
  } finally {
    // Always delete the uploaded file from the server
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Deleted temp file: ${filePath}`);
      } catch (err) {
        console.error(`Failed to delete temp file ${filePath}:`, err);
      }
    }
  }
});

module.exports = router;
