import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.ts';

const COOKIE_NAME = 'caselink_session';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: { id: string; name: string; email: string; role: 'lawyer' | 'client' };
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters');
  }
  return secret;
}

export function issueSession(res: Response, userId: string): void {
  const token = jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: '7d' });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearSession(res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      res.status(401).json({ error: 'กรุณาเข้าสู่ระบบ' });
      return;
    }

    const payload = jwt.verify(token, getJwtSecret());
    if (typeof payload === 'string' || !payload.sub) {
      res.status(401).json({ error: 'เซสชันไม่ถูกต้อง' });
      return;
    }

    const user = await UserModel.findById(payload.sub).select('_id name email role');
    if (!user) {
      res.status(401).json({ error: 'ไม่พบบัญชีผู้ใช้' });
      return;
    }

    req.userId = user._id.toString();
    req.user = {
      id: req.userId,
      name: user.name,
      email: user.email,
      role: user.role as 'lawyer' | 'client',
    };
    next();
  } catch {
    res.status(401).json({ error: 'เซสชันหมดอายุหรือไม่ถูกต้อง' });
  }
}
