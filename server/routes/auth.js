/**
 * File: server/routes/auth.js
 * Description: Authentication routes providing JWT HTTP-Only cookie registration,
 *              local login, Google OAuth authentication & account linking, logout,
 *              account deletion, and active user session retrieval.
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { OAuth2Client } = require('google-auth-library');

const User = require('../models/User');
const AnalysisResult = require('../models/AnalysisResult');
const Chat = require('../models/Chat');
const ChatHistory = require('../models/ChatHistory');
const { uploadToCloudinary } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Multer memory storage for parsing uploaded profile picture buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP) are allowed.'));
    }
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'hirecore_os_secret_key_2026';

// Helper to set HTTP-only cookie
const sendTokenCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  res.cookie('token', token, options);
  return token;
};

// POST /api/auth/google - Authenticate or Link account via Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required',
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      return res.status(401).json({
        success: false,
        message: 'Google authentication failed',
      });
    }

    let user = await User.findOne({
      email: payload.email.toLowerCase().trim(),
    });

    if (!user) {
      user = await User.create({
        name: payload.name || payload.email.split('@')[0],
        email: payload.email.toLowerCase().trim(),
        profilePic: payload.picture,
        provider: 'google',
        providerId: payload.sub,
        accounts: ['google'],
        isVerified: true,
        course: 'B.Tech'
      });
    } else {
      // Account linking logic
      if (!user.accounts.includes('google')) {
        user.accounts.push('google');
      }
      if (!user.providerId) {
        user.provider = 'google';
        user.providerId = payload.sub;
      }
      if (!user.profilePic || user.profilePic.includes('unsplash')) {
        user.profilePic = payload.picture;
      }
      user.isVerified = true;
      await user.save();
    }

    sendTokenCookie(res, user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        course: user.course,
        tier: user.tier,
        accounts: user.accounts,
        provider: user.provider
      }
    });
  } catch (err) {
    console.error('Error in googleLogin:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error occurred during Google authentication.'
    });
  }
});

// POST /api/auth/register - Register a new candidate
router.post('/register', upload.single('profilePic'), async (req, res) => {
  try {
    const { name, email, password, course } = req.body;

    if (!name || !email || !password || !course) {
      return res.status(400).json({ message: 'Name, email, password, and course are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      // Account linking: If user previously registered via Google, allow attaching local password
      if (existingUser.accounts.includes('google') && !existingUser.password) {
        const salt = await bcrypt.genSalt(10);
        existingUser.password = await bcrypt.hash(password, salt);
        if (!existingUser.accounts.includes('local')) {
          existingUser.accounts.push('local');
        }
        await existingUser.save();
        sendTokenCookie(res, existingUser._id);
        return res.status(200).json({
          success: true,
          message: 'Password linked to existing Google account.',
          user: {
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            profilePic: existingUser.profilePic,
            course: existingUser.course,
            tier: existingUser.tier,
            accounts: existingUser.accounts
          }
        });
      }
      return res.status(400).json({ message: 'An account with this email address already exists.' });
    }

    // Upload profile picture to Cloudinary if file provided
    let profilePicUrl = undefined;
    if (req.file) {
      profilePicUrl = await uploadToCloudinary(req.file.buffer, 'hirecore_avatars', req.file.mimetype);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User record
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      course,
      profilePic: profilePicUrl,
      accounts: ['local'],
      provider: 'local',
      tier: 'free',
      isVerified: true
    });

    await newUser.save();

    // Set JWT HTTP-only cookie
    sendTokenCookie(res, newUser._id);

    res.status(201).json({
      success: true,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic,
        course: newUser.course,
        tier: newUser.tier,
        accounts: newUser.accounts
      }
    });

  } catch (error) {
    console.error('Error in registration route:', error);
    res.status(500).json({ message: error.message || 'Error occurred during candidate registration.' });
  }
});

// POST /api/auth/login - Candidate login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials provided.' });
    }

    if (!user.password && user.accounts.includes('google')) {
      return res.status(400).json({
        message: 'This email is linked to Google OAuth. Please sign in with Google or register a password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials provided.' });
    }

    if (!user.accounts.includes('local')) {
      user.accounts.push('local');
      await user.save();
    }

    // Set JWT HTTP-only cookie
    sendTokenCookie(res, user._id);

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        course: user.course,
        tier: user.tier,
        accounts: user.accounts
      }
    });

  } catch (error) {
    console.error('Error in login route:', error);
    res.status(500).json({ message: 'Internal server error during authentication.' });
  }
});

// POST /api/auth/logout - Clear HTTP-only session cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none'
  });
  res.json({ success: true, message: 'Logged out successfully.' });
});

// DELETE /api/auth/delete - Permanently delete candidate account and all user data
router.delete('/delete', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete associated analysis results and chats
    await Promise.all([
      AnalysisResult.deleteMany({ userId }),
      Chat.deleteMany({ userId }),
      ChatHistory.deleteMany({ userId })
    ]);

    // Delete user profile
    await User.findByIdAndDelete(userId);

    // Clear session cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    });

    res.json({ success: true, message: 'Candidate account and associated data permanently deleted.' });
  } catch (error) {
    console.error('Error deleting candidate account:', error);
    res.status(500).json({ message: 'Internal server error while deleting candidate account.' });
  }
});

// GET /api/auth/me - Retrieve current authenticated user profile
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;
