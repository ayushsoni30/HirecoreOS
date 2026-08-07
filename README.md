# HireCore OS

Institutional-Grade AI Platform for Technical Candidate Evaluation, Resume Analytics, and Interview Preparation.

HireCore OS is an open-standard, AI-powered evaluation operating system designed for software developers, candidates, and engineering teams. It bridges the gap between curriculum vitae parsing, domain-specific technical assessment, project-based oral examinations, and real-time performance analytics.

Built on top of a full-stack Node.js/Express and React 19 architecture, HireCore OS uses Cerebras AI inference models (`llama-3.3-70b` / `gpt-oss-120b`) to deliver low-latency, academically rigorous candidate scoring and structured technical feedback.

---

## 1. Core Architectural Capabilities

### [01] Smart Resume Analyzer
* **PDF Extraction Engine**: Processes raw candidate CVs using `pdf-parse` to extract clean textual content across multi-page documents.
* **Job Description Alignment**: Performs cross-correlation between candidate technical experience and target job requirements using Cerebras AI models.
* **Quantitative Scoring Matrix**: Computes an objective 0-100 match percentage score.
* **Gap & Strengths Analysis**: Generates structured arrays detailing matching candidate strengths, critical missing technical skills, and actionable optimization advice.
* **Persistent History**: Automatically serializes analysis records to MongoDB for historical tracking.

### [02] Subject Technical Interview Practice
* **Domain Matrix**: Supports tailored testing across Computer Science core domains: Python, JavaScript, MERN Full Stack, DevOps, Java, C++, System Design, Data Structures & Algorithms, and Database Management.
* **Dynamic Problem Synthesis**: Synthesizes 5 subject-specific questions per assessment session with varying difficulty tiers.
* **Quantitative Answer Evaluation**: Evaluates candidate submitted code and text answers, computing individual question scores, overall session percentage, and ideal reference solutions.
* **Clean Formatting Standard**: Enforces clean academic markdown rendering free of informal symbols or emojis.

### [03] Resume-Based Contextual Oral Exam
* **Personalized CV Parsing**: Ingests the candidate's actual resume PDF to extract listed projects, open-source work, and specialized tech stacks.
* **Project Ownership Testing**: Synthesizes 5 custom oral exam questions targeting the candidate's declared projects, testing architectural decisions, edge case handling, and implementation depth.
* **Turn-by-Turn Assessment**: Accepts candidate answers, grades explanation accuracy, and archives overall contextual performance metrics.

### [04] Tech Buddy Research Assistant
* **Ultra-Low Latency Inference**: Interactive technical companion powered by Cerebras Llama models.
* **Multi-Domain Knowledge Base**: Provides assistance on algorithm optimization, system design trade-offs, code refactoring, and framework troubleshooting.
* **Syntax-Highlighted Code Blocks**: Renders responses using `react-markdown`, `remark-gfm`, and `rehype-highlight` with monospaced code frame headers.
* **Session Persistence**: Maintains thread history in MongoDB with single-click session resets.

### [05] Live Performance Analytics
* **Central Command Dashboard**: Displays real-time candidate metrics, including average resume match scores, technical test averages, evaluation counts, and recent activity logs.
* **Circular Progress Indicators**: Utilizes `react-circular-progressbar` with theme-adaptive stroke contrast for instant visual feedback.
* **Aggregated Activity Feed**: Pulls recent resume analyses and technical interview sessions via MongoDB aggregation pipelines.

### [06] Multi-Factor Security & OAuth
* **HTTP-Only JWT Cookies**: Manages authenticated sessions using secure, HTTP-Only cookies to protect tokens against cross-site scripting (XSS) attacks.
* **Google OAuth Integration**: Supports Google single sign-on using `@react-oauth/google` on the client and `google-auth-library` on the server for ID token verification.
* **Account Linking System**: Tracks candidate auth methods using an `account: ['local', 'google']` enum field in the Mongoose `User` schema.
* **Input Sanitization**: Protects against field injection and enforces strict schema validation across all API endpoints.

---

## 2. Technical Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 19, React Router v7, Vite |
| **Styling & Aesthetics** | Vanilla CSS, Tailwind CSS, Framer Motion |
| **UI Components** | Lucide React, React Circular Progressbar, React Markdown, Rehype Highlight |
| **Backend Runtime** | Node.js, Express.js |
| **Database & ORM** | MongoDB, Mongoose v8 |
| **AI Inference Engine** | Cerebras Cloud API (`llama-3.3-70b` / `gpt-oss-120b`) |
| **Document Processing** | `pdf-parse` (Client-to-Server Multipart Upload) |
| **Media Storage** | Cloudinary API, Multer Storage Engine |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), Google Auth Library (`google-auth-library`), `bcryptjs` |

---

## 3. Directory Structure

```
hirecore-os/
├── client/                      # React 19 Frontend Web Application
│   ├── src/
│   │   ├── components/          # Reusable Academic UI Components
│   │   │   ├── AuthContext.jsx  # Global Auth & Modal Context
│   │   │   ├── CustomCursor.jsx # Academic Precision Pointer
│   │   │   ├── HcLogo.jsx       # Institutional Brand Mark
│   │   │   ├── Navbar.jsx       # Header Navigation Bar
│   │   │   ├── Sidebar.jsx      # Navigation Menu
│   │   │   ├── ThemeContext.jsx # Light/Dark Mode Manager
│   │   │   └── ToastContext.jsx # Notification Alert System
│   │   ├── hooks/               # Custom React Hooks
│   │   │   └── useApi.js        # Axios Axios Instance Hook
│   │   ├── pages/               # Application Page Views
│   │   │   ├── AboutPage.jsx    # Engineering Faculty Dossier
│   │   │   ├── AuthModal.jsx    # Candidate Gateway Modal
│   │   │   ├── Dashboard.jsx    # Live Performance Command Center
│   │   │   ├── LandingPage.jsx  # System Architecture Overview
│   │   │   ├── ResumeAnalyzer.jsx # Resume Alignment Engine
│   │   │   ├── ResumeBasedInterview.jsx # Contextual CV Exam Simulator
│   │   │   ├── TechBuddy.jsx    # AI Research Assistant
│   │   │   └── TechInterviewPractice.jsx # Subject Exam Simulator
│   │   ├── utils/
│   │   │   └── api.js           # Pre-configured Axios Instance
│   │   ├── App.jsx              # Routing & Layout Root
│   │   ├── index.css            # Design System Tokens & Color Variables
│   │   └── main.jsx             # Entry Point Initialization
│   └── package.json
│
└── server/                      # Express REST API Server
    ├── config/
    │   ├── db.js                # MongoDB Mongoose Connection
    │   └── cloudinary.js        # Cloudinary SDK Configuration
    ├── middleware/
    │   ├── auth.js              # JWT HTTP-Only Cookie Verifier
    │   ├── upload.js            # Multer File Storage Handler
    │   └── rateLimiter.js       # Express Rate Limiting Engine
    ├── models/
    │   ├── User.js              # Candidate Schema (Auth, Course, Account Types)
    │   ├── AnalysisResult.js    # Resume Match Document Schema
    │   ├── InterviewSession.js  # Technical & Resume Exam Records
    │   └── ChatSession.js       # Tech Buddy Conversation History
    ├── routes/
    │   ├── auth.js              # Registration, Login, OAuth, Profile Endpoints
    │   ├── dashboard.js         # Analytics Aggregation Endpoints
    │   ├── resume.js            # Resume Parsing & AI Scoring Endpoint
    │   ├── interview.js         # Domain Tech Exam Generator & Evaluator
    │   ├── resumeInterview.js   # Resume Contextual Exam Endpoints
    │   └── techBuddy.js         # AI Chat Assistant Endpoints
    ├── utils/
    │   └── cerebras.js          # Cerebras LLM Client Wrapper
    ├── index.js                 # Express Application Bootstrap
    └── package.json
```

---

## 4. API Specification Reference

### Authentication Endpoints (`/api/auth`)
* `POST /api/auth/register` — Registers candidate with `name`, `email`, `password`, `course`, and optional `profilePic` image file. Sets HTTP-Only JWT cookie.
* `POST /api/auth/login` — Authenticates candidate via local email and password. Sets HTTP-Only JWT cookie.
* `POST /api/auth/google` — Verifies Google OAuth ID token credential via `google-auth-library`. Creates or updates user account and sets HTTP-Only JWT cookie.
* `GET /api/auth/me` — Fetches current authenticated candidate profile.
* `POST /api/auth/logout` — Clears HTTP-Only authentication cookie.
* `DELETE /api/auth/delete` — Deletes current candidate account and associated database records.

### Dashboard Analytics (`/api/dashboard`)
* `GET /api/dashboard/stats` — Returns overall aggregated candidate metrics (average resume score, average interview score, test counts).
* `GET /api/dashboard/recent-analyses` — Retrieves recent resume evaluation records.
* `GET /api/dashboard/recent-interviews` — Retrieves recent technical interview session records.

### Resume Evaluation (`/api/resume`)
* `POST /api/resume/analyze` — Multipart endpoint receiving `resume` PDF file and `jobDescription` string. Returns structured JSON containing match score, strengths, missing skills, and detailed feedback.

### Subject Technical Interview (`/api/interview`)
* `POST /api/interview/generate` — Ingests `technology` domain and returns 5 generated technical exam questions.
* `POST /api/interview/submit` — Ingests candidate submitted answers, computes scoring, and stores interview session record.

### Contextual Resume Interview (`/api/resume-interview`)
* `POST /api/resume-interview/generate` — Multipart endpoint receiving candidate `resume` PDF file. Extracts projects/skills and returns 5 personalized contextual questions.
* `POST /api/resume-interview/submit` — Grades candidate oral answers against contextual reference metrics.

### AI Assistant (`/api/tech-buddy`)
* `POST /api/tech-buddy/message` — Ingests candidate message string, queries Cerebras AI inference model, updates persistent chat thread, and returns AI response.
* `POST /api/tech-buddy/reset` — Clears candidate's active chat thread history.

---

## 5. System Design & Aesthetic Standard

HireCore OS follows a **Scholarly Academic Paper** design language:
* **Border Radius**: 0px across all UI elements, inputs, modals, buttons, and cards.
* **Typography**: Primary serif rendered in `Libertinus Serif` / `Georgia`, paired with monospaced metadata labels (`[SYSTEM_CAPABILITIES]`, `[01]`, `[AUTH_GATEWAY]`).
* **Color Palette**:
  * **Dark Mode**: High-contrast charcoal `#0d0c0a` background, paper text `#f5f4ef`, muted borders `#26241e`, burnt amber accent `#c85a17`.
  * **Light Mode**: Crisp archival paper `#f5f4ef` background, deep charcoal text `#0d0c0a`, light borders `#e0ddd3`.
* **Zero Informal Elements**: Responses and interface labels adhere strictly to institutional formatting without informal emojis or casual placeholders.

---

## 6. Environment Setup Guide

### Server Environment Configuration (`server/.env`)
Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hirecore_os
JWT_SECRET=your_secure_jwt_secret_key_here
CEREBRAS_API_KEY=your_cerebras_api_key_here
CEREBRAS_MODEL=llama-3.3-70b
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
* Node.js v18.0.0 or higher
* npm v9.0.0 or higher
* MongoDB instance running locally or via MongoDB Atlas

### Step 1: Clone Repository
```bash
git clone https://github.com/rishhbh/hirecore-os.git
cd hirecore-os
```

### Step 2: Install & Start Backend Server
```bash
cd server
npm install
npm run dev
```
The server will start listening on `http://localhost:5000`.

### Step 3: Install & Start Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## 8. Core Developers & Faculty

* **Rishabh Sharma** — Backend Engineer & AI Systems Lead
  * GitHub: [/rishhbh](https://github.com/rishhbh)
  * Portfolio: [rishabhh.is-a.dev](https://rishabhh.is-a.dev)
  * Specialization: MERN Architecture, REST API Design, AWS Infrastructure, Cerebras AI Pipeline Engineering.

* **Ayush Soni** — Full Stack Developer & GenAI Specialist
  * GitHub: [/ayushsoni30](https://github.com/ayushsoni30)
  * Portfolio: [myport-pi-two.vercel.app](https://myport-pi-two.vercel.app/)
  * Specialization: React 19, GenAI Integrations, RAG Architecture, AI Agent Development.

---

## 9. License

Distributed under the MIT License. See `LICENSE` for more information.
