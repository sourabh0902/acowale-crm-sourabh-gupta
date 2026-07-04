import rateLimit from 'express-rate-limit';

// Strict limiter for POST /api/feedback — prevents spam submissions
export const feedbackSubmissionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please try again in a minute.' },
});

// General limiter applied to all routes — coarse defense against abuse
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
});

// Strict limiter for POST /api/auth/login — prevents brute-force password guessing.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
});
