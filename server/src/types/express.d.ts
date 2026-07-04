// Extends the Express Request type with a `user` property populated by the
// auth middleware after verifying a JWT. This lets handlers safely read
// req.user.email and req.user.role.

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string; // user ID (Mongo _id as string)
        email: string;
        role: 'admin';
      };
    }
  }
}

export {};
