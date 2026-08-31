/**
 * File: server/utils/groq.js
 * Description: AI inference utility powered directly by Groq SDK (openai/gpt-oss-120b).
 */

const { Groq } = require('groq-sdk');
const { systemPrompt: defaultSystemPrompt } = require('../prompts/systemPrompt');

/**
 * Remove any emojis or decorative symbols from string
 * @param {String} str 
 * @returns {String}
 */
const stripEmojis = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F800}-\u{1F8FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}]/gu, '');
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
 * Safely extract an array from a response object
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
 * Perform inference directly via Groq SDK (openai/gpt-oss-120b).
 */
const callGroq = async (
  prompt,
  parseJson = true,
  systemInstruction = null,
  modelName = process.env.GROQ_MODEL || 'openai/gpt-oss-120b'
) => {
  const apiKey = process.env.GROQ_API_KEY || process.env.CEREBRAS_API_KEY;
  if (!apiKey || apiKey.startsWith('your_') || apiKey.trim() === '') {
    throw new Error('Groq API Key is missing or invalid. Please configure GROQ_API_KEY in your .env file.');
  }

  const NO_EMOJI_DIRECTIVE = "STRICT DIRECTIVE: Do NOT use any emojis, emoticons, or decorative icons in your response under any circumstances. Maintain a strictly professional, academic tone.";

  const effectiveSystemInstruction = systemInstruction || defaultSystemPrompt;
  const combinedSystemInstruction = `${effectiveSystemInstruction}\n\n${NO_EMOJI_DIRECTIVE}`;

  let messages = [
    { role: 'system', content: combinedSystemInstruction }
  ];

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

  const groq = new Groq({ apiKey });

  const options = {
    messages: messages,
    model: modelName,
    temperature: parseJson ? 0.2 : 1,
    max_completion_tokens: 2048,
    top_p: 1,
    stream: !parseJson,
    reasoning_effort: 'medium',
    stop: null
  };

  if (parseJson) {
    options.response_format = { type: 'json_object' };
  }

  let rawText = '';

  if (options.stream) {
    const chatCompletion = await groq.chat.completions.create(options);
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || '';
      rawText += content;
    }
  } else {
    const chatCompletion = await groq.chat.completions.create(options);
    rawText = chatCompletion.choices[0]?.message?.content || '';
  }

  const noEmojiText = stripEmojis(rawText);
  const cleanedText = stripMarkdownFences(noEmojiText);

  if (parseJson) {
    return JSON.parse(cleanedText);
  }
  return cleanedText;
};

module.exports = {
  callGroq,
  callCerebras: callGroq,
  stripMarkdownFences,
  stripEmojis,
  extractArrayFromResponse
};
