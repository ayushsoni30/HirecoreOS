/**
 * File: server/routes/resumeInterview.js
 * Description: API endpoints for generating questions based on parsed PDF resumes and
 *              evaluating candidates' answers using Cerebras AI.
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const pdfParse = require('pdf-parse');
const upload = require('../middleware/upload');
const { checkJwt, syncUser } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { callCerebras, extractArrayFromResponse } = require('../utils/cerebras');
const AnalysisResult = require('../models/AnalysisResult');

// POST /api/resume-interview/generate - Upload PDF and generate 12 custom questions
router.post('/generate', checkJwt, syncUser, aiLimiter, upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a resume PDF file.' });
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
    const prompt = `You are a technical interviewer. Read this resume carefully and generate 12 personalized interview questions based on the candidate's projects, skills, and experience mentioned.
Resume:
${resumeText}

Return a JSON object with a key "questions" containing an array of 12 question strings: {"questions": ["q1", "q2", ...]}. No numbering or extra text.`;

    const responseData = await callCerebras(prompt, true);
    const questions = extractArrayFromResponse(responseData);

    if (!questions || questions.length === 0) {
      throw new Error('AI did not return a list of questions.');
    }

    res.json({
      success: true,
      questions
    });

  } catch (error) {
    console.error('Error generating resume interview questions:', error);
    res.status(500).json({ message: error.message || 'Error occurred while processing resume.' });
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

// POST /api/resume-interview/evaluate - Score responses, provide feedback, strengths and weaknesses
router.post('/evaluate', checkJwt, syncUser, aiLimiter, async (req, res) => {
  const { responses } = req.body; // responses: Array of { question: string, answer: string }

  if (!responses || !Array.isArray(responses) || responses.length === 0) {
    return res.status(400).json({ message: 'Interview responses list is required.' });
  }

  try {
    // Format transcript
    const transcript = responses
      .map((r, i) => `Question ${i + 1}: ${r.question}\nCandidate Answer: ${r.answer || '[No answer provided]'}`)
      .join('\n\n');

    const prompt = `You are a technical interviewer. Evaluate the candidate's answers to these personalized resume-based questions.
Questions and answers:
${transcript}

Return JSON with:
- totalScore: number (0-100)
- feedback: array of objects { question, userAnswer, verdict (correct/partial/wrong), suggestion }
- strengths: array of strings
- weaknesses: array of strings
Return only valid JSON.`;

    const evaluation = await callCerebras(prompt, true);

    const score = evaluation && evaluation.totalScore !== undefined ? evaluation.totalScore : (evaluation?.score || 0);
    const pros = evaluation ? (evaluation.strengths || evaluation.pros || []) : [];
    const cons = evaluation ? (evaluation.weaknesses || evaluation.cons || []) : [];
    const feedback = evaluation ? (evaluation.feedback || []) : [];

    // Save results into MongoDB
    const analysis = new AnalysisResult({
      userId: req.mongoUser._id,
      type: 'resume-interview',
      score: score,
      pros: pros,
      cons: cons,
      feedback: feedback
    });

    await analysis.save();

    res.json({
      success: true,
      analysisId: analysis._id,
      score: analysis.score,
      pros: analysis.pros,
      cons: analysis.cons,
      feedback: analysis.feedback
    });

  } catch (error) {
    console.error('Error evaluating resume interview responses:', error);
    res.status(500).json({ message: error.message || 'Error occurred during interview evaluation.' });
  }
});

module.exports = router;
