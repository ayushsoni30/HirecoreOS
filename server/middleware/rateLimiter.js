/**
 * File: server/middleware/rateLimiter.js
 * Description: Configures rate-limiting middleware to prevent API abuse.
 *              Limits incoming requests on AI routes to 20 requests per 15 minutes per IP.
 */

const rateLimit = require('express-rate-limit');

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    message: 'Rate limit exceeded: Max 20 AI requests per 15 minutes. Please try again later.'
  },
  standardHeaders: true, // Return rate limit info in standard headers
  legacyHeaders: false, // Disable legacy headers
});

module.exports = {
  aiLimiter
};
