/**
 * File: server/routes/interviewPractice.js
 * Description: API endpoints for generating structured technical interview questions and
 *              evaluating submitted answers using Gemini.
 */

const express = require('express');
const router = express.Router();
const { checkJwt, syncUser } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { callGemini } = require('../utils/gemini');
const AnalysisResult = require('../models/AnalysisResult');

// List of supported technologies for standard practice interviews
const ALLOWED_TECHS = [
  'Python', 'JavaScript', 'MERN Full Stack', 'DevOps', 'Java',
  'React', 'Node.js', 'SQL', 'Docker', 'AWS', 'Data Structures & Algorithms'
];

// POST /api/interview/generate - Generate 12 technology interview questions
router.post('/generate', checkJwt, syncUser, aiLimiter, async (req, res) => {
  const { technology } = req.body;

  if (!technology || !ALLOWED_TECHS.includes(technology)) {
    return res.status(400).json({ message: 'A valid technology selection is required.' });
  }

  try {
    const prompt = `Generate 12 top interview questions for ${technology}. Return JSON array of strings only. No numbering, no explanation.`;
    let questions = await callGemini(prompt, true);

    if (questions && !Array.isArray(questions) && Array.isArray(questions.questions)) {
      questions = questions.questions;
    }

    if (!Array.isArray(questions)) {
      throw new Error('AI did not return a list of questions.');
    }

    res.json({
      success: true,
      technology,
      questions
    });
  } catch (error) {
    console.error('Error generating technology questions:', error);
    res.status(500).json({ message: error.message || 'Error occurred while generating interview questions.' });
  }
});

// POST /api/interview/evaluate - Score responses, provide feedback, strengths and weaknesses
router.post('/evaluate', checkJwt, syncUser, aiLimiter, async (req, res) => {
  const { technology, responses } = req.body; // responses: Array of { question: string, answer: string }

  if (!technology || !ALLOWED_TECHS.includes(technology)) {
    return res.status(400).json({ message: 'A valid technology selection is required.' });
  }

  if (!responses || !Array.isArray(responses) || responses.length === 0) {
    return res.status(400).json({ message: 'Interview responses list is required.' });
  }

  try {
    // Formulate a clean transcript of the interview to send to Gemini
    const transcript = responses
      .map((r, i) => `Question ${i + 1}: ${r.question}\nCandidate Answer: ${r.answer || '[No answer provided]'}`)
      .join('\n\n');

    const prompt = `You are a senior interviewer. Evaluate the following answers for ${technology} interview questions.
Questions and answers:
${transcript}

Return JSON with:
- totalScore: number (0-100)
- feedback: array of objects { question, userAnswer, verdict (correct/partial/wrong), suggestion }
- strengths: array of strings
- weaknesses: array of strings
Return only valid JSON.`;

    const evaluation = await callGemini(prompt, true);

    const score = evaluation && evaluation.totalScore !== undefined ? evaluation.totalScore : (evaluation?.score || 0);
    const pros = evaluation ? (evaluation.strengths || evaluation.pros || []) : [];
    const cons = evaluation ? (evaluation.weaknesses || evaluation.cons || []) : [];
    const feedback = evaluation ? (evaluation.feedback || []) : [];

    // Save results into MongoDB database
    const analysis = new AnalysisResult({
      userId: req.mongoUser._id,
      type: 'tech-interview',
      technology,
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
    console.error('Error evaluating interview answers:', error);
    res.status(500).json({ message: error.message || 'Error occurred during interview evaluation.' });
  }
});

module.exports = router;
