# HireCore OS

Institutional-Grade AI Platform for Technical Candidate Evaluation, Resume Analytics, and Interview Preparation.

HireCore OS is an open-standard, AI-powered evaluation operating system designed for software developers, candidates, and engineering teams. It bridges the gap between curriculum vitae parsing, domain-specific technical assessment, project-based contextual interviews, and real-time performance analytics.

Built on top of a full-stack Node.js/Express and React 19 architecture, HireCore OS uses Groq AI inference models (`llama-3.1-8b-instant` / configurable via `GROQ_MODEL`) to deliver low-latency, academically rigorous candidate scoring and structured technical feedback.

---

## 1. Core Architectural Capabilities

### [01] Smart Resume Analyzer
* **PDF Extraction Engine**: Processes candidate CVs using `pdf-parse` to extract clean textual content across multi-page documents via multipart uploads.
* **Job Description Alignment**: Performs semantic cross-correlation between candidate technical experience and target job requirements using Groq AI.
* **Quantitative Scoring Matrix**: Computes an objective 0–100 match percentage score.
* **Gap & Strengths Analysis**: Generates structured feedback detailing matching candidate strengths, critical missing skills, and actionable recommendations.
* **Persistent History**: Automatically serializes analysis records to MongoDB via `AnalysisResult` for historical tracking.

### [02] Subject Technical Interview Practice
* **Domain Matrix**: Supports tailored assessments across 11 core engineering domains: **Python, JavaScript, MERN Full Stack, DevOps, Java, React, Node.js, SQL, Docker, AWS, and Data Structures & Algorithms**.
* **Dynamic Problem Synthesis**: Synthesizes **12** subject-specific interview questions per session using Groq AI.
* **Quantitative Answer Evaluation**: Evaluates submitted responses, computing individual question verdicts (correct, partial, incorrect), suggestions, overall score (0–100), and strengths/weaknesses.
* **Clean Formatting Standard**: Enforces clean academic markdown rendering free of informal symbols or emojis.

### [03] Resume-Based Contextual Interview
* **Personalized CV Ingestion**: Reads the candidate's uploaded resume PDF to extract listed projects, skills, and technical background.
* **Project Ownership Testing**: Synthesizes **12** custom technical questions probing architectural decisions, implementation depth, and edge cases from candidate-declared projects.
* **Turn-by-Turn Evaluation**: Accepts written answers, assesses technical accuracy against candidate CV claims, and archives performance metrics.

### [04] Tech Buddy Research Assistant
* **Ultra-Low Latency Inference**: Interactive technical companion powered by Groq LLM inference.
* **Multi-Domain Knowledge Base**: Provides consultation on algorithm optimization, system design trade-offs, code refactoring, and framework troubleshooting.
* **Syntax-Highlighted Code Blocks**: Renders responses using `react-markdown`, `remark-gfm`, and `rehype-highlight` with monospaced code frame headers.
* **Session Persistence & Reset**: Maintains thread history in MongoDB (`Chat` & `ChatHistory`) with single-click session clearing.

### [05] Live Performance Analytics
* **Central Command Dashboard**: Displays real-time candidate metrics, fetching the latest resume match score, technical interview score, and resume interview score via `/api/dashboard/summary`.
* **Circular Progress Indicators**: Utilizes `react-circular-progressbar` with theme-adaptive stroke contrast for instant visual feedback.
* **Account Controls**: Provides candidate profile metadata inspection and permanent account deletion with cascade data cleanup.

### [06] Multi-Factor Security & API Resilience
* **Express Rate Limiter**: Protects AI-intensive endpoints against abuse and token budget exhaustion with an IP-based rate limiter (**20 requests per 15 minutes**).
* **HTTP-Only JWT Cookies**: Manages authenticated sessions using secure, HTTP-Only cookies (`SameSite` enabled) to mitigate cross-site scripting (XSS).
* **Google OAuth Integration**: Supports Google single sign-on using `@react-oauth/google` on the client and `google-auth-library` on the server for ID token verification.
* **Account Linking System**: Tracks candidate auth methods using an `accounts: ['local', 'google']` enum array in the Mongoose `User` schema.
* **Helmet Security Headers**: Enforces strict Content Security Policy (CSP), HTTP Strict Transport Security (HSTS with 1-year max age), `X-Frame-Options: SAMEORIGIN`, and `X-Content-Type-Options: nosniff`.

---

## 2. Technical Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 19, React Router v7, Vite |
| **Styling & Aesthetics** | Tailwind CSS v3, Framer Motion, Vanilla CSS |
| **UI Components** | Lucide React, React Circular Progressbar, React Markdown, Rehype Highlight |
| **Backend Runtime** | Node.js v22 (LTS), Express.js v4 |
| **Database & ORM** | MongoDB, Mongoose v8 |
| **AI Inference Engine** | Groq Cloud SDK (`llama-3.1-8b-instant` / configurable via `GROQ_MODEL`) |
| **API Protection** | `express-rate-limit` (20 req/15 min on AI routes), `helmet` (CSP, HSTS) |
| **Document Processing** | `pdf-parse` (Client-to-Server Multipart Upload via Multer) |
| **Media Storage** | Cloudinary API, Multer Memory Storage |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), Google Auth Library (`google-auth-library`), `bcryptjs` |
| **Containerization** | Docker (`node:22-alpine`), Docker Compose (`mongo:7-jammy`) |

---

## 3. Directory Structure

```
hirecore-os/
├── docker-compose.yml           # Multi-container orchestration (Backend + MongoDB 7)
├── LICENSE                      # MIT Open Source License
├── CONTRIBUTION.md              # Code Style & PR Guidelines
├── README.md                    # System Documentation
│
├── client/                      # React 19 Frontend Web Application
│   ├── src/
│   │   ├── components/          # UI & Context Components
│   │   │   ├── AuthContext.jsx  # Global Auth & Modal Context
│   │   │   ├── HcLogo.jsx       # Brand Mark
│   │   │   ├── Navbar.jsx       # Header Navigation Bar
│   │   │   ├── Sidebar.jsx      # Navigation Menu
│   │   │   ├── ThemeContext.jsx # Light/Dark Mode Manager
│   │   │   └── ToastContext.jsx # Notification Alert System
│   │   ├── hooks/               # Custom React Hooks
│   │   │   └── useApi.js        # Pre-configured Axios Hook
│   │   ├── pages/               # Application Page Views
│   │   │   ├── AboutPage.jsx    # Developer & Faculty Dossier
│   │   │   ├── AuthModal.jsx    # Login / Register Modal Dialog
│   │   │   ├── Dashboard.jsx    # Live Performance Command Center
│   │   │   ├── LandingPage.jsx  # System Architecture Overview
│   │   │   ├── PrivacyPolicy.jsx # Privacy Policy (/privacy)
│   │   │   ├── SmartResumeAnalyzer.jsx # Resume Alignment Engine
│   │   │   ├── ResumeBasedInterview.jsx # Contextual CV Interview Simulator
│   │   │   ├── TechBuddy.jsx    # AI Research Assistant
│   │   │   ├── TechInterviewPractice.jsx # Subject Exam Simulator
│   │   │   └── TermsOfService.jsx # Terms of Service (/terms)
│   │   ├── utils/
│   │   │   └── api.js           # Pre-configured Axios Instance
│   │   ├── App.jsx              # Routing & Layout Root
│   │   ├── index.css            # Design System Tokens & Color Variables
│   │   └── main.jsx             # Entry Point Initialization
│   ├── vercel.json              # SPA Rewrites for Vercel Deployment
│   └── package.json
│
└── server/                      # Express REST API Server
    ├── Dockerfile               # Production Dockerfile (node:22-alpine)
    ├── .dockerignore            # Build Context Exclusion Rules
    ├── config/
    │   ├── db.js                # MongoDB Mongoose Connection
    │   └── cloudinary.js        # Cloudinary SDK Configuration
    ├── middleware/
    │   ├── auth.js              # JWT HTTP-Only Cookie Verifier
    │   ├── upload.js            # Multer File Storage Handler
    │   └── rateLimiter.js       # Express Rate Limiting Middleware (20 req/15 min)
    ├── models/
    │   ├── User.js              # User Schema (Auth, Accounts, Course, Tier)
    │   ├── AnalysisResult.js    # Unified Evaluation Document Schema
    │   ├── Chat.js              # Active Tech Buddy Conversation Schema
    │   └── ChatHistory.js       # Historical Archived Chat Schema
    ├── routes/
    │   ├── auth.js              # Registration, Login, OAuth, Profile Endpoints
    │   ├── dashboard.js         # Analytics Aggregation Endpoint
    │   ├── resumeAnalyzer.js    # Resume Parsing & Scoring Endpoint
    │   ├── interviewPractice.js # Domain Tech Exam Generator & Evaluator
    │   ├── resumeInterview.js   # Resume Contextual Exam Endpoints
    │   └── techBuddy.js         # AI Chat Assistant Endpoints
    ├── utils/
    │   ├── groq.js              # Groq LLM SDK Wrapper
    │   └── cerebras.js          # Groq Legacy Backward-Compatibility Proxy
    ├── prompts/
    │   └── systemPrompt.js      # Centralized System Prompt Definition
    ├── index.js                 # Express Application Bootstrap
    └── package.json
```

---

## 4. API Specification Reference

### Authentication Endpoints (`/api/auth`)
* `POST /api/auth/register` — Registers candidate with `name`, `email`, `password`, `course`, and optional `profilePic` image. Sets HTTP-Only JWT cookie.
* `POST /api/auth/login` — Authenticates candidate via email and password. Sets HTTP-Only JWT cookie.
* `POST /api/auth/google` — Verifies Google OAuth credential token via `google-auth-library`. Sets HTTP-Only JWT cookie.
* `GET /api/auth/me` — Fetches current authenticated user profile (`protect` middleware).
* `POST /api/auth/logout` — Clears HTTP-Only authentication cookie.
* `DELETE /api/auth/delete` — Permanently deletes candidate account, evaluation records, and chat history.

### Dashboard Analytics (`/api/dashboard`)
* `GET /api/dashboard/summary` — Retrieves the latest evaluation metrics across all three tools: Resume Analyzer score, Subject Interview score, and Contextual Resume Interview score.

### Resume Evaluation (`/api/resume-analyzer`)
* `POST /api/resume-analyzer` — Protected endpoint (`checkJwt`, `syncUser`, `aiLimiter`). Accepts multipart `resume` PDF and `jobDescription` string. Returns match score (0–100), pros, cons, and granular feedback.

### Subject Technical Interview (`/api/interview`)
* `POST /api/interview/generate` — Protected endpoint (`checkJwt`, `syncUser`, `aiLimiter`). Ingests `technology` (one of 11 supported domains) and returns **12** technical interview questions.
* `POST /api/interview/evaluate` — Protected endpoint (`checkJwt`, `syncUser`, `aiLimiter`). Ingests candidate submitted responses, grades each response, stores the session in `AnalysisResult`, and returns the score breakdown.

### Contextual Resume Interview (`/api/resume-interview`)
* `POST /api/resume-interview/generate` — Protected endpoint (`checkJwt`, `syncUser`, `aiLimiter`). Ingests `resume` PDF file, parses projects/skills, and returns **12** personalized technical questions.
* `POST /api/resume-interview/evaluate` — Protected endpoint (`checkJwt`, `syncUser`, `aiLimiter`). Ingests candidate answers, cross-references against resume claims, stores evaluation in `AnalysisResult`, and returns feedback.

### AI Assistant (`/api/tech-buddy`)
* `POST /api/tech-buddy/chat` — Protected endpoint (`protect`, `aiLimiter`). Accepts a user `message`, appends it to user's conversation thread, queries Groq AI, and returns the response.
* `GET /api/tech-buddy/history` — Protected endpoint (`protect`). Retrieves message history for the candidate's active chat session.
* `POST /api/tech-buddy/clear` — Protected endpoint (`protect`). Archives/resets the active conversation session and starts a fresh thread.

---

## 5. System Design & Aesthetic Standard

HireCore OS follows a **Scholarly Academic Paper** design language — hard geometry, ink-on-paper contrast, editorial typography, and motion with restraint.

### 5.1 Design Philosophy
* **Strict zero radius** — `border-radius: 0px !important` applied globally in CSS across all elements.
* **Typographic hierarchy** — Serif body (`Libertinus Serif` / `EB Garamond` / Georgia) paired with monospaced metadata labels (`JetBrains Mono`).
* **No informal elements** — No emojis, no rounded "bubble" UI, no casual styling.
* **Border-over-shadow** — Elevation is communicated through crisp bordered containment rather than drop shadows.
* **Restrained motion** — Framer Motion animations only where they communicate functional state.

### 5.2 Color Tokens

| Token | Hex | Role |
| :--- | :--- | :--- |
| `paper-950` | `#141312` | Dark mode page background |
| `paper-900` | `#1D1B19` | Dark mode card / panel background |
| `paper-800` | `#25221F` | Dark mode primary border |
| `paper-50` | `#FBF9F5` | Light mode background / dark-surface text |
| `paper-200` | `#E5E0D8` | Light mode border |
| `accent` | `#9A3412` | Terracotta — primary interactive accent (both modes) |
| `secondary` | `#D97706` | Academic Gold / Warm Amber |
| `success` | `#15803D` | Positive evaluation feedback |
| `error` | `#B91C1C` | Destructive / failure states |

Theme switching is managed via `ThemeContext.jsx` with dark-mode default and `.light` utility variants.

### 5.3 Legal Routes
`/privacy` ([PrivacyPolicy.jsx](./client/src/pages/PrivacyPolicy.jsx)) and `/terms` ([TermsOfService.jsx](./client/src/pages/TermsOfService.jsx)) are public routes accessible without authentication.

---

## 6. Environment Setup Guide

### Server Environment Configuration (`server/.env`)
Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hirecore_os
JWT_SECRET=your_secure_jwt_secret_key_here
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
GOOGLE_CLIENT_ID=your_google_client_id_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

### Client Environment Configuration (`client/.env`)
Create a `.env` file inside the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

## 7. Local Installation & Launch

### Prerequisites
* Node.js v22.0.0 or higher (LTS)
* npm v9.0.0 or higher
* Docker & Docker Compose (Optional)
* MongoDB running locally or via MongoDB Atlas

### Option A: Local Native Setup

1. **Clone Repository**:
   ```bash
   git clone https://github.com/ayushsoni30/CF.git
   cd CF
   ```

2. **Start Backend Server**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Start Frontend Client**:
   In a separate terminal:
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Option B: Docker Containerized Setup
Run both the Express API container (`node:22-alpine`) and MongoDB container (`mongo:7-jammy`) simultaneously:
```bash
docker compose up --build
```
The Express API will be exposed at `http://localhost:5000` and MongoDB at `localhost:27017`.

---

## 8. Contributions & Code Standards

We welcome community contributions. Please read our [Contribution Guidelines](./CONTRIBUTION.md) before submitting Pull Requests.

---

## 9. Core Developers & Faculty

* **Rishabh Sharma** — Backend Engineer & AI Systems Lead
  * GitHub: [/rishhbh](https://github.com/rishhbh)
  * Portfolio: [rishabhh.is-a.dev](https://rishabhh.is-a.dev)
  * Specialization: MERN Architecture, REST API Design, AWS Infrastructure, Groq AI Pipeline Engineering.

* **Ayush Soni** — Full Stack Developer & GenAI Specialist
  * GitHub: [/ayushsoni30](https://github.com/ayushsoni30)
  * Portfolio: [myport-pi-two.vercel.app](https://myport-pi-two.vercel.app/)
  * Specialization: React 19, GenAI Integrations, RAG Architecture, AI Agent Development.

---

## 10. License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.
