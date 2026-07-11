/**
 * File: server/routes/techBuddy.js
 * Description: API endpoints for the Tech Buddy conversational assistant.
 *              Maintains multi-turn context and filters for non-technical requests.
 */

const express = require('express');
const router = express.Router();
const { checkJwt, syncUser } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { callGemini } = require('../utils/gemini');
const ChatHistory = require('../models/ChatHistory');

// System instruction to enforce tech-only responses and markdown formatting
const SYSTEM_INSTRUCTION = `You are Tech Buddy, a highly knowledgeable technical assistant. You ONLY answer questions related to technology, programming, software development, DevOps, career roadmaps in IT, and related technical topics. If someone asks about anything non-technical, politely decline and say you only discuss tech topics. Always format your responses using Markdown: use headings, bullet points, code blocks where relevant. Be concise but thorough.`;

// POST /api/tech-buddy/chat - Handle a user message and generate a chat response
router.post('/chat', checkJwt, syncUser, aiLimiter, async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ message: 'Message content is required.' });
  }

  try {
    // Find the latest active chat session for the user
    let chatSession = await ChatHistory.findOne({ userId: req.mongoUser._id }).sort({ updatedAt: -1 });

    // If no session exists, create a new one
    if (!chatSession) {
      chatSession = new ChatHistory({
        userId: req.mongoUser._id,
        messages: []
      });
    }

    // Append the user's message
    chatSession.messages.push({
      role: 'user',
      content: message
    });

    // Format full conversation history for Gemini API
    const geminiContents = chatSession.messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    // Call Gemini (expect text/markdown output, not JSON)
    const botResponse = await callGemini(geminiContents, false, SYSTEM_INSTRUCTION);

    // Append the bot's response
    chatSession.messages.push({
      role: 'model',
      content: botResponse
    });

    // Save the conversation history
    await chatSession.save();

    res.json({
      success: true,
      response: botResponse,
      history: chatSession.messages
    });

  } catch (error) {
    console.error('Error in Tech Buddy chat route:', error);
    res.status(500).json({ message: error.message || 'Error occurred while talking to Tech Buddy.' });
  }
});

// GET /api/tech-buddy/history - Get messages from the active chat session
router.get('/history', checkJwt, syncUser, async (req, res) => {
  try {
    const chatSession = await ChatHistory.findOne({ userId: req.mongoUser._id }).sort({ updatedAt: -1 });
    res.json({
      success: true,
      history: chatSession ? chatSession.messages : []
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Error occurred while retrieving chat history.' });
  }
});

// POST /api/tech-buddy/clear - End current session and start a new empty one
router.post('/clear', checkJwt, syncUser, async (req, res) => {
  try {
    // Creating a new document ensures that the next message creates a fresh history
    // while the previous chat sessions are preserved in the DB.
    const newSession = new ChatHistory({
      userId: req.mongoUser._id,
      messages: []
    });
    await newSession.save();

    res.json({
      success: true,
      message: 'New chat session started.',
      history: []
    });
  } catch (error) {
    console.error('Error clearing chat session:', error);
    res.status(500).json({ message: 'Error occurred while starting a new chat.' });
  }
});

module.exports = router;
