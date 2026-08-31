/**
 * File: server/utils/cerebras.js
 * Description: Backward compatibility proxy forwarding calls to Groq AI inference engine.
 */

const {
  callGroq,
  stripMarkdownFences,
  stripEmojis,
  extractArrayFromResponse
} = require('./groq');

module.exports = {
  callCerebras: callGroq,
  callGroq,
  stripMarkdownFences,
  stripEmojis,
  extractArrayFromResponse
};
