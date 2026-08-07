/**
 * File: server/utils/cerebras.js
 * Description: AI inference utility powered by Cerebras Cloud (GPT-OSS-120B).
 *              Uses OpenAI-compatible Chat Completions API with fallback markdown stripping,
 *              robust JSON array extraction, and strict emoji removal to enforce professional academic responses.
 */

const axios = require('axios');

/**
 * Remove any emojis or decorative symbols from string
 * @param {String} str 
 * @returns {String}
 */
const stripEmojis = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}]/gu, '');
};

const stripMarkdownFences = (text) => {
  if (!text) return '';
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, '');
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  return cleaned.trim();
};

/**
 * Safely extract an array from a Cerebras JSON response object
 * @param {Object|Array} resObj 
 * @returns {Array}
 */
const extractArrayFromResponse = (resObj) => {
  if (Array.isArray(resObj)) return resObj;
  if (!resObj || typeof resObj !== 'object') return [];
  
  if (Array.isArray(resObj.questions)) return resObj.questions;
  if (Array.isArray(resObj.interview_questions)) return resObj.interview_questions;
  if (Array.isArray(resObj.data)) return resObj.data;
  if (Array.isArray(resObj.results)) return resObj.results;
  if (Array.isArray(resObj.list)) return resObj.list;
  
  const arrayVal = Object.values(resObj).find(val => Array.isArray(val));
  if (arrayVal) return arrayVal;

  return [];
};

/**
 * Perform inference via Cerebras API
 * @param {String|Array} prompt - String prompt or array of conversation messages
 * @param {Boolean} parseJson - Whether to parse output as JSON
 * @param {String} systemInstruction - Optional system instruction prompt
 * @param {String} modelName - Cerebras model name (defaults to gpt-oss-120b)
 */
const callCerebras = async (prompt, parseJson = true, systemInstruction = null, modelName = process.env.CEREBRAS_MODEL || 'gpt-oss-120b') => {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    throw new Error('Cerebras API key is not configured in .env (CEREBRAS_API_KEY missing).');
  }

  const url = 'https://api.cerebras.ai/v1/chat/completions';

  const NO_EMOJI_DIRECTIVE = "STRICT DIRECTIVE: Do NOT use any emojis, emoticons, or decorative icons in your response under any circumstances. Maintain a strictly professional, academic tone.";

  // Format messages array for OpenAI / Cerebras API
  let messages = [];

  const combinedSystemInstruction = systemInstruction 
    ? `${systemInstruction}\n\n${NO_EMOJI_DIRECTIVE}` 
    : NO_EMOJI_DIRECTIVE;

  messages.push({ role: 'system', content: combinedSystemInstruction });

  if (Array.isArray(prompt)) {
    prompt.forEach(item => {
      let role = item.role === 'model' ? 'assistant' : (item.role || 'user');
      let content = '';

      if (typeof item.content === 'string') {
        content = item.content;
      } else if (item.parts && Array.isArray(item.parts)) {
        content = item.parts.map(p => p.text || '').join('');
      } else {
        content = String(item);
      }

      messages.push({ role, content });
    });
  } else {
    messages.push({ role: 'user', content: String(prompt) });
  }

  const requestBody = {
    model: modelName,
    messages: messages,
    temperature: parseJson ? 0.2 : 0.7
  };

  if (parseJson) {
    requestBody.response_format = { type: 'json_object' };
  }

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (
      !response.data ||
      !response.data.choices ||
      response.data.choices.length === 0 ||
      !response.data.choices[0].message ||
      !response.data.choices[0].message.content
    ) {
      throw new Error('Invalid response structure from Cerebras API');
    }

    const rawText = response.data.choices[0].message.content;
    const noEmojiText = stripEmojis(rawText);
    const cleanedText = stripMarkdownFences(noEmojiText);

    if (parseJson) {
      try {
        return JSON.parse(cleanedText);
      } catch (jsonErr) {
        console.error('Failed to parse Cerebras response as JSON. Raw text:', rawText);
        throw new Error('AI response was not valid JSON: ' + jsonErr.message);
      }
    }

    return cleanedText;
  } catch (error) {
    console.error('Error calling Cerebras API:', error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.error?.message || error.message || 'Error occurred while executing Cerebras inference.');
  }
};

module.exports = {
  callCerebras,
  stripMarkdownFences,
  stripEmojis,
  extractArrayFromResponse
};
