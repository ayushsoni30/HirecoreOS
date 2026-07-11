/**
 * File: server/index.js
 * Description: Express server entry point. Configures middleware, establishes database
 *              connections, and mounts API route modules.
 */

// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Import routes
const dashboardRoutes = require('./routes/dashboard');
const resumeAnalyzerRoutes = require('./routes/resumeAnalyzer');
const interviewPracticeRoutes = require('./routes/interviewPractice');
const resumeInterviewRoutes = require('./routes/resumeInterview');
const techBuddyRoutes = require('./routes/techBuddy');

// Initialize express app
const app = express();

// Connect to Database
connectDB();

// Security and utility Middlewares
app.use(helmet());

// CORS configuration (Allows frontend access from default Vite port)
const allowedOrigin = 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/resume-analyzer', resumeAnalyzerRoutes);
app.use('/api/interview', interviewPracticeRoutes);
app.use('/api/resume-interview', resumeInterviewRoutes);
app.use('/api/tech-buddy', techBuddyRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SuccessBuddy AI API Server is running smoothly.' });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Requested resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  
  // Custom error response structure
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error occurred on SuccessBuddy AI backend.'
  });
});

// Start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SuccessBuddy AI server running on port ${PORT}`);
});
