import { Router } from 'express';
import { submitFeedback, getFeedback } from '../controllers/feedback.controller';
import { login } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { createFeedbackSchema } from '../validators/feedback';
import { loginSchema } from '../validators/auth';
import {
    feedbackSubmissionLimiter,
    loginLimiter,
} from '../middleware/rateLimiter';

const router = Router();

router.post('/auth/login', loginLimiter, validate(loginSchema), login);

// Public — anyone can submit feedback
router.post(
    '/feedback',
    feedbackSubmissionLimiter,
    validate(createFeedbackSchema),
    submitFeedback
);

// Protected — only authenticated admin can view all feedback
router.get('/feedback', requireAuth, getFeedback);

export default router;
