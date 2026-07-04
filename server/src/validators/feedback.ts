import { z } from 'zod';
import { FEEDBACK_CATEGORIES } from '../models/Feedback';

export const createFeedbackSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').optional().or(z.literal('')),
  category: z.enum(FEEDBACK_CATEGORIES),
  message: z
    .string()
    .trim()
    .min(5, 'Message must be at least 5 characters')
    .max(2000),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
