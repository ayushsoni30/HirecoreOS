const axios = require('axios');

const stripMarkdownFences = (text) => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, '');
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  return cleaned.trim();
};

const callGemini = async (prompt, parseJson = true, systemInstruction = null, modelName = 'gemini-2.5-flash') => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured in .env.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: Array.isArray(prompt) ? prompt : [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  try {
    const response = await axios.post(url, requestBody, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (
      !response.data ||
      !response.data.candidates ||
      response.data.candidates.length === 0 ||
      !response.data.candidates[0].content ||
      !response.data.candidates[0].content.parts ||
      response.data.candidates[0].content.parts.length === 0
    ) {
      throw new Error('Invalid response structure from Gemini API');
    }

    const rawText = response.data.candidates[0].content.parts[0].text;
    const cleanedText = stripMarkdownFences(rawText);

    if (parseJson) {
      try {
        return JSON.parse(cleanedText);
      } catch (jsonErr) {
        console.error('Failed to parse Gemini response as JSON. Raw response:', rawText);
        throw new Error('Response returned from AI was not valid JSON: ' + jsonErr.message);
      }
    }

    return cleanedText;
  } catch (error) {
    console.error('Error calling Gemini API:', error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.error?.message || error.message || 'Error occurred while calling Gemini API');
  }
};

module.exports = {
  callGemini,
  stripMarkdownFences
};
