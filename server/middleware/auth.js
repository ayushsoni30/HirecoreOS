/**
 * File: server/middleware/auth.js
 * Description: JWT HTTP-only cookie authentication middleware.
 *              Verifies JWT token from cookies or Authorization header,
 *              retrieves candidate details from MongoDB, and attaches to req.user / req.mongoUser.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Read token from HTTP-only cookie or Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. Please sign in.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'hirecore_os_secret_key_2026';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User session not found or invalid.' });
    }

    req.user = user;
    req.mongoUser = user; // For backwards compatibility with existing route handlers
    next();
  } catch (error) {
    console.error('JWT Authentication error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired session token. Please sign in again.' });
  }
};

module.exports = {
  protect,
  checkJwt: protect,
  syncUser: (req, res, next) => next() // No-op middleware since protect handles user loading
};
