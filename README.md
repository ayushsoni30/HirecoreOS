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
| **Backend Runtime** | Node.js v22 (LTS), Express.js |
| **Database & ORM** | MongoDB, Mongoose v8 |
| **AI Inference Engine** | Cerebras Cloud API (`llama-3.3-70b` / `gpt-oss-120b`) |
| **Document Processing** | `pdf-parse` (Client-to-Server Multipart Upload) |
| **Media Storage** | Cloudinary API, Multer Storage Engine |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), Google Auth Library (`google-auth-library`), `bcryptjs` |
| **Containerization** | Docker (`node:22-alpine`), Docker Compose (`mongo:7-jammy`) |

---

## 3. Directory Structure

```
hirecore-os/
├── docker-compose.yml           # Root Docker Orchestration Config
├── DESIGN.md                    # Visual Identity & UI/UX System Guide
├── LICENSE                      # MIT Open Source License
├── CONTRIBUTION.md              # Code Style & PR Guidelines
├── CONTRIBUTING.md              # Contribution Reference Pointer
├── README.md                    # Institutional System Documentation
├── client/                      # React 19 Frontend Web Application
│   ├── src/
│   │   ├── components/          # Reusable Academic UI Components
│   │   │   ├── AuthContext.jsx  # Global Auth & Modal Context
│   │   │   ├── CustomCursor.jsx # Academic Precision Pointer (z-[100000])
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
│   │   │   ├── PrivacyPolicy.jsx # Privacy Policy (public, /privacy)
│   │   │   ├── ResumeAnalyzer.jsx # Resume Alignment Engine
│   │   │   ├── ResumeBasedInterview.jsx # Contextual CV Exam Simulator
│   │   │   ├── TechBuddy.jsx    # AI Research Assistant
│   │   │   ├── TechInterviewPractice.jsx # Subject Exam Simulator
│   │   │   └── TermsOfService.jsx # Terms of Service (public, /terms)
│   │   ├── utils/
│   │   │   └── api.js           # Pre-configured Axios Instance
│   │   ├── App.jsx              # Routing & Layout Root
│   │   ├── index.css            # Design System Tokens & Color Variables
│   │   └── main.jsx             # Entry Point Initialization
│   └── package.json
│
└── server/                      # Express REST API Server
    ├── Dockerfile               # Production Docker Container Specification (node:22-alpine)
    ├── .dockerignore            # Build Context Exclusion Rules
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

HireCore OS follows a **Scholarly Academic Paper** design language — hard geometry, ink-on-paper contrast, editorial typography, and motion with restraint. Below is a structured summary; the full specification lives in **[DESIGN.md](./DESIGN.md)**.

### 5.1 Design Philosophy
* **Strict zero radius** — `border-radius: 0px !important` applied globally in CSS and all Tailwind tokens remapped to `0px`.
* **Typographic hierarchy** — Serif body (`Libertinus Serif` / `EB Garamond` / Georgia) paired with monospaced metadata labels (`JetBrains Mono`).
* **No informal elements** — No emojis, no casual placeholders, no rounded "bubble" UI.
* **Border-over-shadow** — Elevation is communicated through bordered containment, not drop shadows (all shadow tokens resolve to `none`).
* **Restrained motion** — Framer Motion animations only where they communicate state.

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

Theme switching uses a `.light` class on `<html>`, managed by `ThemeContext.jsx`. The Tailwind plugin registers a `light:` variant for dual-mode utility classes.

### 5.3 Typography Scale

| Family | Stack | Usage |
| :--- | :--- | :--- |
| **Serif** | `Libertinus Serif`, `EB Garamond`, Georgia | Body copy, all headings, UI labels |
| **Monospace** | `JetBrains Mono`, Courier New | System badges, code blocks, metadata |

Monospace system tags follow the `[NAMESPACE // SECTION_LABEL]` convention — uppercase, `tracking-widest`, `text-accent`.

### 5.4 Core Component Patterns

* **System Tag Badge** — `inline-flex` pill with `bg-accent/10 border border-accent/30 text-accent font-mono text-xs uppercase tracking-widest`.
* **Section Title** — `border-l-2 border-accent pl-4` left-rule with serif heading and optional mono sub-label.
* **Card / Panel** — `border border-paper-800 bg-paper-900/50` — no shadow, no radius.
* **Accent Callout Block** — `border border-accent/20 bg-accent/5` with `[LABEL]` mono header for explicit commitments or warnings.
* **Metadata Grid** — Compact `grid` of key/value pairs in `font-mono text-xs` inside a bordered `bg-paper-950` panel.

### 5.5 Motion

* **Route transitions** — `opacity 0→1, y 8→0` / `opacity 1→0, y 0→-8` at `0.25s easeOut` via Framer Motion `AnimatePresence`.
* **Splash screen** — Full-screen overlay with a `1.3s` progress bar, exits with a `[0.16, 1, 0.3, 1]` cubic-bezier spring.
* **Toast notifications** — `animate-slide-in` CSS keyframe (`translateY(1rem) → 0`, `0.25s cubic-bezier(0.16, 1, 0.3, 1)`).

### 5.6 Custom Cursor

A canvas-rendered academic precision pointer in `CustomCursor.jsx` runs at `z-[100000]`. Active on `min-width: 768px`; native cursor is suppressed via `cursor: none !important` in `index.css`.

### 5.7 Legal Routes

`/privacy` ([PrivacyPolicy.jsx](./client/src/pages/PrivacyPolicy.jsx)) and `/terms` ([TermsOfService.jsx](./client/src/pages/TermsOfService.jsx)) are **public routes** (no authentication required) rendered in the same editorial design language as all other pages.

> **Full reference**: See [DESIGN.md](./DESIGN.md) for complete color ramps, spacing guidelines, scrollbar spec, autofill neutralization, syntax highlighting configuration, and accessibility notes.

---

## 6. Environment Setup Guide

### Server Environment Configuration (`server/.env`)
Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hirecore_os
JWT_SECRET=your_secure_jwt_secret_key_here
CEREBRAS_API_KEY=your_cerebras_api_key_here
CEREBRAS_MODEL=gpt-oss-120b
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
* MongoDB instance running locally or via MongoDB Atlas

### Option A: Local Native Setup

1. **Clone Repository**:
   ```bash
   git clone https://github.com/ayushsoni30/CF.git
   cd hirecore-os
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
  * Specialization: MERN Architecture, REST API Design, AWS Infrastructure, Cerebras AI Pipeline Engineering.

* **Ayush Soni** — Full Stack Developer & GenAI Specialist
  * GitHub: [/ayushsoni30](https://github.com/ayushsoni30)
  * Portfolio: [myport-pi-two.vercel.app](https://myport-pi-two.vercel.app/)
  * Specialization: React 19, GenAI Integrations, RAG Architecture, AI Agent Development.

---

## 10. License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.
