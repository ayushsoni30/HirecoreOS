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
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const resumeAnalyzerRoutes = require('./routes/resumeAnalyzer');
const interviewPracticeRoutes = require('./routes/interviewPractice');
const resumeInterviewRoutes = require('./routes/resumeInterview');
const techBuddyRoutes = require('./routes/techBuddy');

// Initialize express app
const app = express();

// Connect to Database
connectDB();

// CORS configuration (Allows frontend access from default Vite port)
// Registered first to process OPTIONS preflight requests before security/fallback headers
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// Security and utility Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.google.com", "https://accounts.google.com"],
      connectSrc: ["'self'", "http://localhost:5000", "https://api.cloudinary.com", "https://accounts.google.com", "https://api.cerebras.ai"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://lh3.googleusercontent.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://fonts.cdnfonts.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.cdnfonts.com"],
      frameSrc: ["'self'", "https://accounts.google.com"],
      frameAncestors: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: null
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  xFrameOptions: { action: "sameorigin" },
  xContentTypeOptions: true,
}));

// Custom fallback middleware to guarantee headers are set under all conditions
app.use((req, res, next) => {
  // Skip modifying OPTIONS preflights (handled by CORS middleware)
  if (req.method === 'OPTIONS') {
    return next();
  }

  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Set HSTS only over HTTPS/secure connection to prevent local dev breakage
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(morgan('dev'));

// Cookie parser middleware for reading HTTP-only JWT cookies
app.use(cookieParser());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/resume-analyzer', resumeAnalyzerRoutes);
app.use('/api/interview', interviewPracticeRoutes);
app.use('/api/resume-interview', resumeInterviewRoutes);
app.use('/api/tech-buddy', techBuddyRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'HireCore OS API Server is running smoothly.' });
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
    message: err.message || 'Internal server error occurred on HireCore OS backend.'
  });
});

// Start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`HireCore OS server running on port ${PORT}`);
});
