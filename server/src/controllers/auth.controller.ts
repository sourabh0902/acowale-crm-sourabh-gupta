import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { env } from '../config/env';

const TOKEN_EXPIRY = '24h';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Fetch user including the password field (which is normally excluded via select: false)
    const user = await User.findOne({ email }).select('+password');

    // Generic error for both "user not found" and "wrong password" — never leak which failed
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatches = await user.comparePassword(password);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    return res.status(200).json({
      data: {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
}
