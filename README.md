# HireCore OS 🏛️

**HireCore OS** is an advanced, production-grade AI-powered career preparation platform designed to help aspiring software developers and IT professionals accelerate their job search and interview readiness. By combining the power of the **Cerebras AI (GPT-OSS-120B)** with a modern full-stack architecture, HireCore OS delivers intelligent resume analysis, automated mock technical interviews, personalized resume-based simulators, and 24/7 technical career mentoring.

---

## 🌟 Key Features

1. **Smart Resume Analyzer** 📄
   * Upload your resume PDF and paste any Job Description.
   * AI scores the alignment (0-100%) and details key **Strengths (Pros)** and **Gaps/Weaknesses (Cons)**.

2. **Tech Interview Practice** 💻
   * Choose a technical domain (Python, JavaScript, MERN, DevOps, AWS, Data Structures, etc.).
   * AI generates 12 top topic-specific questions and evaluates your submitted answers, providing a senior-interviewer score and suggestions.

3. **Resume-Based Interview** 👤
   * Simulate a highly personalized mock interview.
   * AI extracts projects, achievements, and skills from your uploaded resume to ask 12 targeted custom questions and grade your answers.

4. **Tech Buddy** 💬
   * A 24/7 AI mentor chat to discuss career roadmaps, programming concepts, code debugging, and framework setups.

---

## 📂 Project Structure

```
hirecore-os/
├── client/           # React + Vite frontend web app
│   ├── src/          # Components, pages, hooks, and context
│   └── .env          # Client environment configurations
├── server/           # Express backend API server
│   ├── config/       # Database & Cloudinary config
│   ├── middleware/   # Rate limiting, file upload, JWT cookie auth
│   ├── models/       # Mongoose schemas (User, AnalysisResult, Chat)
│   ├── routes/       # API endpoints (auth, dashboard, resume, interview, tech buddy)
│   ├── utils/        # Cerebras AI GPT-OSS-120B client
│   └── .env          # Server environment configurations
```

---

## 📝 Environment Variables

### 1. Backend: `server/.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hirecore_os
JWT_SECRET=your_jwt_secret_key
CEREBRAS_API_KEY=your_cerebras_api_key_here
CEREBRAS_MODEL=gpt-oss-120b
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

### 2. Frontend: `client/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 How to Run

### Step 1: Start the Backend Server
```bash
cd server
npm install
npm run dev
```

### Step 2: Start the Frontend Client
```bash
cd client
npm install
npm run dev
```
