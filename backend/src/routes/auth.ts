import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { UserModel } from '../models/User.ts';
import { clearSession, issueSession, requireAuth, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();
const credentialsSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(200),
  role: z.enum(['lawyer', 'client']).optional(),
  lawyerLicenseId: z.string().trim().max(100).optional(),
});

function publicUser(user: {
  _id: unknown;
  name: string;
  email: string;
  role: string;
  lawyerLicenseId?: string | null;
  avatar?: string | null;
}) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    lawyerLicenseId: user.lawyerLicenseId,
    avatar: user.avatar,
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const input = credentialsSchema.extend({ name: z.string().trim().min(1).max(200), role: z.enum(['lawyer', 'client']) }).parse(req.body);
    const exists = await UserModel.exists({ email: input.email.toLowerCase() });
    if (exists) {
      res.status(409).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
      return;
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await UserModel.create({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      role: input.role,
      lawyerLicenseId: input.lawyerLicenseId,
    });
    issueSession(res, user._id.toString());
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const input = credentialsSchema.pick({ email: true, password: true }).parse(req.body);
    const user = await UserModel.findOne({ email: input.email.toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
      return;
    }

    issueSession(res, user._id.toString());
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (_req, res) => {
  clearSession(res);
  res.status(204).send();
});

router.get('/me', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'ไม่พบบัญชีผู้ใช้' });
      return;
    }
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

export default router;
