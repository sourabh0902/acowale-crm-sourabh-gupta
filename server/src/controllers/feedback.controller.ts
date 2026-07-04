import { Request, Response } from 'express';
import Feedback from '../models/Feedback';
import { listFeedbackQuerySchema } from '../validators/feedback';

// Escapes regex special characters so user search input is treated as a
// literal string, not a regex pattern (e.g. searching "." shouldn't match everything).
function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function submitFeedback(req: Request, res: Response) {
  try {
    // Normalize empty-string email to undefined so it's absent, not stored as ""
    const email =
      req.body.email && req.body.email.trim() !== '' ? req.body.email : undefined;

    const feedback = await Feedback.create({ ...req.body, email });
    res.status(201).json({ data: feedback });
  } catch (err) {
    console.error('submitFeedback error:', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
}

export async function getFeedback(req: Request, res: Response) {
  try {
    // Invalid query params fall back to no filters (returns everything)
    const parsed = listFeedbackQuerySchema.safeParse(req.query);
    const { category, range, search } = parsed.success ? parsed.data : {};

    const query: Record<string, unknown> = {};

    if (category) {
      query.category = category;
    }

    if (range === '7d' || range === '30d') {
      const days = range === '7d' ? 7 : 30;
      query.createdAt = { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) };
    }

    if (search && search.trim() !== '') {
      const rx = new RegExp(escapeRegex(search.trim()), 'i');
      query.$or = [{ name: rx }, { email: rx }, { message: rx }];
    }

    const feedback = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .limit(500); // simple cap; would add real pagination at scale

    res.status(200).json({ data: feedback, count: feedback.length });
  } catch (err) {
    console.error('getFeedback error:', err);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
}
