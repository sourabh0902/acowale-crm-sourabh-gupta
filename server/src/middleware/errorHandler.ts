import { Request, Response, NextFunction } from 'express';

// Final safety net: catches anything not already handled inside a route.
// Individual routes handle their own errors with try/catch; this is the backstop.
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
}
