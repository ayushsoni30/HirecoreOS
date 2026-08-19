/**
 * File: server/utils/cerebras.js
 * Description: AI inference utility powered by Cerebras Cloud (GPT-OSS-120B).
 *              Includes automated fallback cascade to Google Gemini API and an offline
 *              local Mock AI engine to prevent 402/429 failures in dev/demo environments.
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
 * Secondary Fallback: Google Gemini API via Axios
 */
const callGeminiFallback = async (prompt, parseJson, systemInstruction) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured.');
  }

  const model = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let contents = [];
  if (Array.isArray(prompt)) {
    contents = prompt.map(item => {
      let role = item.role === 'model' || item.role === 'assistant' ? 'model' : 'user';
      let text = '';
      if (typeof item.content === 'string') {
        text = item.content;
      } else if (item.parts && Array.isArray(item.parts)) {
        text = item.parts.map(p => p.text || '').join('');
      } else {
        text = String(item);
      }
      return {
        role,
        parts: [{ text }]
      };
    });
  } else {
    contents = [{
      role: 'user',
      parts: [{ text: String(prompt) }]
    }];
  }

  const requestBody = {
    contents: contents,
    generationConfig: {
      temperature: parseJson ? 0.2 : 0.7
    }
  };

  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  if (parseJson) {
    requestBody.generationConfig.responseMimeType = 'application/json';
  }

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
  const noEmojiText = stripEmojis(rawText);
  const cleanedText = stripMarkdownFences(noEmojiText);

  if (parseJson) {
    return JSON.parse(cleanedText);
  }

  return cleanedText;
};

/**
 * Tertiary Fallback: Local High-Fidelity Mock Engine
 */
const getMockResponse = (prompt, parseJson) => {
  const promptStr = Array.isArray(prompt) ? JSON.stringify(prompt) : String(prompt);
  
  if (parseJson) {
    // 1. Generate technology practice questions
    if (promptStr.includes('Generate 12 top technical interview questions for') || promptStr.includes('questions for')) {
      const techMatch = promptStr.match(/questions for ([A-Za-z0-9_&#+\-\s&]+)\./i) || promptStr.match(/for ([A-Za-z0-9_&#+\-\s&]+)/i);
      const tech = techMatch ? techMatch[1].trim() : 'JavaScript';
      
      const techQuestions = {
        'Python': [
          "Explain the difference between deep copy and shallow copy in Python.",
          "How does Python's memory management and garbage collection work?",
          "What are decorators in Python and how do you write a custom decorator?",
          "Describe the difference between lists and tuples, and their internal implementations.",
          "What is the Global Interpreter Lock (GIL) and how does it impact multi-threading?",
          "How do you implement a generator in Python and what are its performance benefits?",
          "Explain Python's Method Resolution Order (MRO) with multiple inheritance.",
          "What are *args and **kwargs, and when would you use them?",
          "Describe how context managers work and how to create one using the 'with' statement.",
          "What is the difference between staticmethod and classmethod?",
          "How do you write list comprehensions and what are their performance impacts?",
          "Explain dynamic typing in Python and the usage of Type Hinting."
        ],
        'JavaScript': [
          "Explain JavaScript closures and provide a practical use case.",
          "What is the Event Loop in JavaScript and how does it manage the call stack and callback queue?",
          "Describe the difference between prototype-based inheritance and classical inheritance.",
          "What are the differences between var, let, and const in terms of scoping and hoisting?",
          "Explain how Promises work and the difference between Promise.all and Promise.allSettled.",
          "What is the difference between '==' and '===' operators in JavaScript?",
          "Describe 'this' binding rules in JavaScript and how arrow functions differ.",
          "What is event bubbling and capturing, and how do you prevent them?",
          "Explain debouncing and throttling, and when to use each.",
          "Describe how Web Workers can be used to run multi-threaded scripts in JavaScript.",
          "What is the difference between a shallow clone and deep clone of a JS object?",
          "Explain the purpose of strict mode ('use strict') in JavaScript."
        ],
        'MERN Full Stack': [
          "Explain the Virtual DOM rendering process in React and how reconciliation works.",
          "How does Node.js handle concurrent connections using its single-threaded event loop?",
          "Describe MongoDB's document model and compare it to traditional relational database schemas.",
          "How do you secure JWT authentication cookies in a MERN stack application?",
          "What are React Hooks rules and how does the useEffect cleanup function operate?",
          "Describe Express routing and how error-handling middlewares are defined.",
          "Explain MongoDB indexes, index types, and how to verify index usage in queries.",
          "How do you manage global state in React using Context API vs Redux?",
          "Explain the difference between Server-Side Rendering (SSR) and Client-Side Rendering (CSR).",
          "How do you configure CORS headers on an Express server to allow access to Vite clients?",
          "What is Mongoose middleware (pre/post hooks) and how is it used?",
          "Describe optimistic vs pessimistic updates in React state management."
        ],
        'DevOps': [
          "What is Continuous Integration and Continuous Deployment (CI/CD) and name key pipeline stages?",
          "Explain the difference between a Docker container and a Virtual Machine (VM).",
          "Describe Infrastructure as Code (IaC) and how tools like Terraform manage state.",
          "What is Kubernetes and describe its core components (Pods, Services, Deployments, Kubelet)?",
          "Explain how Blue-Green deployment differs from Canary deployment.",
          "How do you manage secret keys and credentials securely in a CI/CD pipeline?",
          "Describe the difference between Docker storage volume and bind mount.",
          "What is GitOps and how do tools like ArgoCD automate Kubernetes sync?",
          "Explain reverse proxying, load balancing, and how Nginx serves static assets.",
          "What is Prometheus and how does it collect application metrics?",
          "How does DNS resolution work and what are A, CNAME, and MX records?",
          "Describe container orchestration logging strategies in production environments."
        ]
      };

      const selectedQuestions = Object.keys(techQuestions).find(key => tech.toLowerCase().includes(key.toLowerCase())) 
        ? techQuestions[Object.keys(techQuestions).find(key => tech.toLowerCase().includes(key.toLowerCase()))]
        : techQuestions['JavaScript'];
        
      return { questions: selectedQuestions };
    }

    // 2. Generate questions from Resume PDF
    if (promptStr.includes('personalized interview questions') || promptStr.includes('personalized resume-based questions')) {
      return {
        questions: [
          "Based on your resume, explain the architecture of the primary full-stack project you worked on.",
          "You list experience with React 19. How did you handle state updates and render optimizations?",
          "Explain the database schema design of your MERN application and why you chose MongoDB.",
          "Describe a technical challenge you faced while implementing user authentication in your application.",
          "How did you structure the folder directory and dependencies in your recent React project?",
          "Explain your experience with Cerebras or other AI integrations listed on your resume.",
          "How did you handle error boundary management and API timeouts on the frontend?",
          "Describe the testing strategies (unit, integration, or manual) you used in your latest project.",
          "You list B.Tech/relevant coursework. How did you apply Data Structures concepts in your project code?",
          "Explain how you managed profile picture uploads using Cloudinary or similar CDN storage services.",
          "How did you optimize your Node.js backend routes to minimize response latency?",
          "What architecture decisions would you change in your listed projects if you were scaling to 10k users?"
        ]
      };
    }

    // 3. Evaluate responses (Resume Interview / Tech Interview)
    if (promptStr.includes('Evaluate the') || promptStr.includes('verdict') || promptStr.includes('totalScore')) {
      return {
        totalScore: 85,
        strengths: [
          "Shows clear familiarity with core framework concepts and syntax.",
          "Demonstrates solid understanding of asynchronous flow.",
          "Excellent documentation of project structure and setup."
        ],
        weaknesses: [
          "Could go deeper into systems design implications (e.g. scaling limits, indexing details).",
          "Omitted explicit details on secure cookie configuration or CORS edge cases in answers.",
          "Would benefit from discussing caching strategies for low-latency retrieval."
        ],
        feedback: [
          {
            question: "Describe your core architecture.",
            userAnswer: "Full stack MERN setup.",
            verdict: "correct",
            suggestion: "Strong base. Mention server clustering or CDN storage to showcase scaling capability."
          },
          {
            question: "How do you handle authentication securely?",
            userAnswer: "Using JSON Web Tokens.",
            verdict: "partial",
            suggestion: "Explain secure, HTTP-only cookie configuration to secure against XSS injection."
          }
        ]
      };
    }

    // 4. Resume analysis match
    if (promptStr.includes('pros') || promptStr.includes('cons') || promptStr.includes('score')) {
      return {
        score: 82,
        pros: [
          "Strong alignment with React and full-stack development requirements.",
          "Extensive project work illustrating clean division of backend and client components.",
          "Prior experience with third-party APIs (Cloudinary, JWT) matches key requirements."
        ],
        cons: [
          "Limited evidence of deployment automation, CI/CD, or orchestration (Docker/Kubernetes).",
          "Could benefit from highlighting unit/integration testing methodologies.",
          "Should specify experience with relational databases if matching senior roles."
        ]
      };
    }

    return { score: 75, pros: ["Sample pro"], cons: ["Sample con"] };
  } else {
    // Plain text markdown response (Tech Buddy Assistant / chat)
    if (promptStr.includes('recursion') || promptStr.includes('Recursion')) {
      return `### Recursion in Data Structures & Algorithms (DSA)

Recursion is a programming technique where a function calls itself directly or indirectly to solve a problem. It breaks down a complex problem into smaller, manageable sub-problems of the same type.

Every recursive function must contain two essential components:
1. **Base Case**: The condition under which the function stops calling itself and returns a value. Without this, the recursion will run infinitely, resulting in a **Stack Overflow** error.
2. **Recursive Case**: The part of the function where it calls itself with a modified (typically smaller) input, moving closer to the base case.

#### Example: Calculating Factorial in JavaScript

Here is a clean implementation of a recursive factorial function:

\`\`\`javascript
/**
 * Calculates the factorial of a number recursively.
 * @param {number} n - Non-negative integer.
 * @returns {number} Factorial of n.
 */
function factorial(n) {
  // 1. Base Case: 0! and 1! are defined as 1
  if (n === 0 || n === 1) {
    return 1;
  }
  
  // 2. Recursive Case: n! = n * (n - 1)!
  return n * factorial(n - 1);
}

console.log(factorial(5)); // Output: 120
\`\`\`

---
*Note: Currently running in **Demo Fallback Mode** (Cerebras API limit exceeded). Configure a \`GEMINI_API_KEY\` in your \`.env\` file for live AI responses.*`;
    }

    if (promptStr.includes('DevOps') || promptStr.includes('devops')) {
      return `### Practical DevOps Learning Roadmap

Transitioning into a DevOps role requires building competencies across automation, infrastructure management, configuration, containerization, and monitoring. Here is a structured, step-by-step roadmap:

#### Step 1: Programming & Linux Fundamentals
- **Language**: Master scripting with **Python** or **Bash**.
- **OS**: Learn command line execution, user/permissions administration, ssh, networking, and systemd in **Linux**.

#### Step 2: Source Control Management (SCM)
- Learn advanced **Git** workflows (branching, merging, rebasing, pull requests).

#### Step 3: Continuous Integration & Continuous Deployment (CI/CD)
- Learn to write build and deployment pipelines using **GitHub Actions**, **GitLab CI**, or **Jenkins**.

#### Step 4: Containerization
- **Docker**: Understand Dockerfiles, volumes, networks, multi-stage builds, and docker-compose.

#### Step 5: Container Orchestration
- **Kubernetes (K8s)**: Master deployments, pods, services, ingress, configuration maps, and secrets management.

---
*Note: Currently running in **Demo Fallback Mode** (Cerebras API limit exceeded). Configure a \`GEMINI_API_KEY\` in your \`.env\` file for live AI responses.*`;
    }

    if (promptStr.includes('rate-limiter') || promptStr.includes('Rate-Limiter')) {
      return `### Node.js Express Rate-Limiter Configuration

To protect your API backend endpoints from abuse, denial of service (DoS) attacks, or brute force, implement the \`express-rate-limit\` middleware.

#### Clean Installation & Setup

1. Install the package:
   \`\`\`bash
   npm install express-rate-limit
   \`\`\`

2. Integrate the middleware:
   \`\`\`javascript
   const rateLimit = require('express-rate-limit');

   // Configure limits
   const apiLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15-minute window
     max: 100, // Limit each IP to 100 requests per window
     message: {
       status: 429,
       message: 'Too many requests from this IP. Please try again after 15 minutes.'
     },
     standardHeaders: true, // Return standard rate limit headers (Limit, Remaining, Reset)
     legacyHeaders: false, // Disable older X-RateLimit headers
   });

   module.exports = { apiLimiter };
   \`\`\`

---
*Note: Currently running in **Demo Fallback Mode** (Cerebras API limit exceeded). Configure a \`GEMINI_API_KEY\` in your \`.env\` file for live AI responses.*`;
    }

    return `### Tech Buddy AI Assistant

I am currently running in **Demo Fallback Mode** because your Cerebras API key has hit its quota limit or requires billing updates.

#### How to Restore Live AI responses:
1. Get a free or pay-as-you-go API key from **Google Gemini AI Studio** or **Cerebras Cloud Console**.
2. Open your backend environment configuration file [\`server/.env\`](file:///d:/AA%20AYUSH%20PROJECTS/hireCore-OS/CF/server/.env).
3. Set the keys as follows:
   \`\`\`env
   GEMINI_API_KEY=your_gemini_api_key
   # OR update your billing details for:
   CEREBRAS_API_KEY=your_cerebras_api_key
   \`\`\`
4. Restart your Node.js backend. The server will automatically detect the configuration and connect you back to live models!`;
  }
};

/**
 * Perform inference via Cerebras API, falling back to Gemini and then Mock engine on failures.
 */
const callCerebras = async (prompt, parseJson = true, systemInstruction = null, modelName = process.env.CEREBRAS_MODEL || 'gpt-oss-120b') => {
  const apiKey = process.env.CEREBRAS_API_KEY;
  const hasCerebrasKey = apiKey && !apiKey.startsWith('your_') && apiKey.trim() !== '';

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

  // 1. Try Cerebras API
  if (hasCerebrasKey) {
    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 25000 // 25 seconds timeout to trigger fallbacks quickly if hanging
      });

      if (
        response.data &&
        response.data.choices &&
        response.data.choices.length > 0 &&
        response.data.choices[0].message &&
        response.data.choices[0].message.content
      ) {
        const rawText = response.data.choices[0].message.content;
        const noEmojiText = stripEmojis(rawText);
        const cleanedText = stripMarkdownFences(noEmojiText);

        if (parseJson) {
          return JSON.parse(cleanedText);
        }
        return cleanedText;
      }
    } catch (error) {
      console.error('Cerebras API failed or returned billing error:', error.response?.data || error.message);
      // Fall through to Gemini/Mock
    }
  }

  // 2. Fallback to Google Gemini API
  const geminiKey = process.env.GEMINI_API_KEY;
  const hasGeminiKey = geminiKey && !geminiKey.startsWith('your_') && geminiKey.trim() !== '';
  if (hasGeminiKey) {
    try {
      console.log('Attempting Gemini API fallback...');
      return await callGeminiFallback(prompt, parseJson, combinedSystemInstruction);
    } catch (geminiError) {
      console.error('Gemini fallback failed:', geminiError.message);
      // Fall through to Mock
    }
  }

  // 3. Fallback to high-fidelity Offline Mock Engine
  console.log('Using local Offline Mock AI Engine...');
  return getMockResponse(prompt, parseJson);
};

module.exports = {
  callCerebras,
  stripMarkdownFences,
  stripEmojis,
  extractArrayFromResponse
};
