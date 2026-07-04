import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { AuthTokenPayload } from '../types/express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: 'Missing or invalid authorization header' });
  }

  const token = header.slice('Bearer '.length).trim();

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;

    // Basic shape check — a valid signature isn't enough if the payload is malformed
    if (!decoded.sub || !decoded.email || !decoded.role) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    req.user = {
      sub: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    // jwt.verify throws on expired, invalid signature, malformed, etc.
    // Return the same generic 401 for all — never leak *why* it failed to the client.
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
