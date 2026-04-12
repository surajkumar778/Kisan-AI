// ============================================================
//  src/middleware/rateLimiter.js
//  Prevents API abuse — 50 requests per 15 minutes per IP
// ============================================================
const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max:      parseInt(process.env.RATE_LIMIT_MAX)        || 50,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    error: 'Too many requests. Please wait 15 minutes and try again.',
  },
});

module.exports = { rateLimiter };
