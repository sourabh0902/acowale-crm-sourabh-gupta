// Extends the Express Request type with a `user` property populated by the
// auth middleware after verifying a JWT.

export type AuthTokenPayload = {
  sub: string; // user ID (Mongo _id as string)
  email: string;
  role: 'admin';
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}
