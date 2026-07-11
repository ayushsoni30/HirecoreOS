# SuccessBuddy AI 🚀

<p align="center">
  <img src="file:///C:/Users/ayush/.gemini/antigravity/brain/0803f57d-2b55-4b72-b6a2-5c96760bd1bc/success_buddy_logo_1783759520015.png" alt="SuccessBuddy AI Logo" width="160" />
</p>

**SuccessBuddy AI** is an advanced, production-grade AI-powered career preparation platform designed to help aspiring software developers and IT professionals accelerate their job search and interview readiness. By combining the power of the **Google Gemini 2.5 Flash API** with a modern full-stack architecture, SuccessBuddy AI delivers intelligent resume analysis, automated mock technical interviews, personalized resume-based simulators, and 24/7 technical career mentoring.

---

## 🌟 Key Features

1. **Smart Resume Analyzer** 📄
   * Upload your resume PDF and paste any Job Description.
   * AI scores the alignment (0-100%) and details key **Strengths (Pros)** and **Gaps/Weaknesses (Cons)**.

2. **Tech Interview Practice** 💻
   * Choose a technical domain (Python, JavaScript, DevOps, AWS, Data Structures, etc.).
   * AI generates 12 top topic-specific questions and evaluates your submitted answers, providing a senior-interviewer score and suggestions.

3. **Resume-Based Interview** 👤
   * Simulate a highly personalized mock interview.
   * AI extracts projects, achievements, and skills from your uploaded resume to ask 12 targeted custom questions and grade your answers.

4. **Tech Buddy** 💬
   * A 24/7 AI mentor chat to discuss career roadmaps, programming concepts, code debugging, and framework setups.

---

## 🛠️ Tech Stack & Badge Collage

### **Core Frameworks & Tools Collage**
<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="ExpressJS" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
  <img src="https://img.shields.io/badge/Google%20Gemini-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini API" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
</p>

### **Tech Stack (Comma Separated)**
`React.js`, `Vite`, `Tailwind CSS`, `Node.js`, `Express.js`, `MongoDB`, `Mongoose`, `Google Gemini 2.5 Flash API`, `Axios`, `Lucide React Icons`, `React Router DOM`, `React Markdown`, `PDF-Parse`, `Multer`, `Helmet`, `Cors`, `Dotenv`, `Nodemon`

---

## 📂 Project Structure

```
success_buddy/
├── client/           # React + Vite frontend web app
│   ├── src/          # Components, pages, hooks, and context
│   └── .env          # Client environment configurations
├── server/           # Express backend API server
│   ├── config/       # MongoDB Mongoose connection config
│   ├── middleware/   # Rate limiting, file upload, local developer auth
│   ├── models/       # Mongoose schemas (User, AnalysisResult, ChatHistory)
│   ├── routes/       # API endpoints (dashboard, resume, interview, tech buddy)
│   ├── utils/        # Axios wrapper for Google Gemini API
│   └── .env          # Server environment configurations
```

---

## ⚙️ Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) installed (v18+ recommended).
* [MongoDB](https://www.mongodb.com/) running locally (usually on port `27017`) or a MongoDB Atlas URI connection string.
* A Google Gemini API Key (get one from [Google AI Studio](https://aistudio.google.com/)).

---

## 📝 Environment Variables

Create and update the `.env` files in both frontend and backend directories:

### 1. Backend: `server/.env`
Create a `.env` file inside the `server/` directory:
```env
# Port for the backend server
PORT=5000

# MongoDB Connection URI (Local default)
MONGO_URI=mongodb://localhost:27017/careerlaunch

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Frontend: `client/.env`
Create a `.env` file inside the `client/` directory:
```env
# Backend API server URL
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 How to Run

### Step 1: Start the Backend Server
Open a terminal, navigate to the `server` directory, and run:
```bash
# Install dependencies
npm install

# Start backend server in development mode (using nodemon)
npm run dev
```
The server will start running on `http://localhost:5000`.

### Step 2: Start the Frontend Client
Open another terminal, navigate to the `client` directory, and run:
```bash
# Install dependencies
npm install

# Start Vite client development server
npm run dev
```
The frontend will start running on `http://localhost:5173`. Open this URL in your web browser.

---

## 🧹 Codebase Cleanup Done
* Removed all Auth0 configurations from code and environment configurations to simplify local setup.
* Integrated the high-performance **Gemini 2.5 Flash** model across all evaluation routes and chatbot pages.
* Deleted unused template assets (`hero.png`, `react.svg`, `vite.svg`) to keep the repository lightweight.
* Fixed the `ReactMarkdown` code-snippet rendering bug in the Tech Buddy chat.
