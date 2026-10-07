import { Response, Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.ts';
import { CaseModel } from '../models/Case.ts';
import { MessageModel } from '../models/Message.ts';

const router = Router();

// Keys inside `data` are written as `data.<key>` paths, so they must be plain identifiers.
const dataKey = z.string().regex(/^[A-Za-z][A-Za-z0-9_]{0,63}$/);
const RESERVED_DATA_KEYS = new Set(['id', 'messages', 'title', 'type', 'status', 'deadline', 'clientName', 'clientEmail', 'description', 'deletedAt', 'isOwner']);
// Clients may only submit documents and update their checklist; everything else is the lawyer's.
const CLIENT_WRITABLE_DATA_KEYS = new Set(['documents', 'checklist']);

const caseInput = z.object({
  title: z.string().trim().min(1).max(300),
  type: z.string().trim().min(1).max(100),
  status: z.string().trim().min(1).max(100).optional(),
  deadline: z.string().trim().max(100).optional(),
  clientName: z.string().trim().min(1).max(200),
  clientEmail: z.union([z.string().trim().email().max(320), z.literal('')]).optional(),
  description: z.string().max(10000).optional(),
  data: z.record(dataKey, z.unknown()).optional(),
});

const messageInput = z.object({
  text: z.string().trim().min(1).max(5000),
});

type User = NonNullable<AuthenticatedRequest['user']>;

function validId(id: string): boolean {
  return mongoose.isValidObjectId(id);
}

function accessFilter(user: User) {
  if (user.role === 'client') {
    return { $or: [{ ownerId: user.id }, { clientEmail: user.email }] };
  }
  return { ownerId: user.id };
}

function serializeMessage(message: {
  _id: unknown;
  caseId: unknown;
  senderName: string;
  role: string;
  text: string;
  createdAt?: Date;
}) {
  return {
    id: String(message._id),
    caseId: String(message.caseId),
    sender: message.senderName,
    role: message.role,
    text: message.text,
    createdAt: message.createdAt?.toISOString(),
  };
}

function serializeCase(
  caseItem: Record<string, any>,
  user: User,
  messages: ReturnType<typeof serializeMessage>[] = []
) {
  const data = (caseItem.data || {}) as Record<string, unknown>;
  return {
    ...data,
    id: String(caseItem._id),
    title: caseItem.title,
    type: caseItem.type,
    status: caseItem.status,
    deadline: caseItem.deadline || '',
    clientName: caseItem.clientName,
    clientEmail: caseItem.clientEmail || '',
    description: caseItem.description || '',
    deletedAt: caseItem.deletedAt ? new Date(caseItem.deletedAt).toISOString() : undefined,
    updatedAt: caseItem.updatedAt ? new Date(caseItem.updatedAt).toISOString() : undefined,
    isOwner: String(caseItem.ownerId) === user.id,
    messages,
  };
}

function cleanData(data: Record<string, unknown> | undefined): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data || {})) {
    if (!RESERVED_DATA_KEYS.has(key)) result[key] = value;
  }
  return result;
}

async function loadMessagesByCase(caseIds: mongoose.Types.ObjectId[]) {
  const grouped = new Map<string, ReturnType<typeof serializeMessage>[]>();
  if (caseIds.length === 0) return grouped;
  const messages = await MessageModel.find({ caseId: { $in: caseIds } }).sort({ createdAt: 1 }).lean();
  for (const message of messages) {
    const key = String(message.caseId);
    const list = grouped.get(key) || [];
    list.push(serializeMessage(message));
    grouped.set(key, list);
  }
  return grouped;
}

function notFound(res: Response, message = 'ไม่พบคดีหรือไม่มีสิทธิ์เข้าถึง') {
  res.status(404).json({ error: message });
}

function requireLawyer(user: User, res: Response): boolean {
  if (user.role !== 'lawyer') {
    res.status(403).json({ error: 'เฉพาะบัญชีทนายความเท่านั้น' });
    return false;
  }
  return true;
}

router.use(requireAuth);

router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = req.user!;
    const cases = await CaseModel.find({ deletedAt: null, ...accessFilter(user) }).sort({ updatedAt: -1 }).lean();
    const messages = await loadMessagesByCase(cases.map((c) => c._id));
    res.json({ cases: cases.map((c) => serializeCase(c, user, messages.get(String(c._id)))) });
  } catch (error) {
    next(error);
  }
});

router.get('/trash', async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = req.user!;
    const cases = await CaseModel.find({ deletedAt: { $ne: null }, ownerId: user.id }).sort({ deletedAt: -1 }).lean();
    res.json({ cases: cases.map((c) => serializeCase(c, user)) });
  } catch (error) {
    next(error);
  }
});

// New chat messages across every case the user can open, for polling.
router.get('/messages', async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = req.user!;
    const since = typeof req.query.since === 'string' ? new Date(req.query.since) : null;
    const cases = await CaseModel.find({ deletedAt: null, ...accessFilter(user) }).select('_id').lean();
    const filter: Record<string, unknown> = { caseId: { $in: cases.map((c) => c._id) } };
    if (since && !Number.isNaN(since.getTime())) {
      filter.createdAt = { $gt: since };
    }
    const messages = await MessageModel.find(filter).sort({ createdAt: 1 }).limit(500).lean();
    res.json({ messages: messages.map(serializeMessage), serverTime: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = req.user!;
    if (!requireLawyer(user, res)) return;
    const input = caseInput.parse(req.body);
    const caseItem = await CaseModel.create({
      ...input,
      status: input.status || 'กำลังดำเนินการ',
      clientEmail: input.clientEmail || '',
      description: input.description || '',
      data: cleanData(input.data),
      ownerId: user.id,
      memberIds: [],
    });
    res.status(201).json({ case: serializeCase(caseItem.toObject(), user) });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = req.user!;
    if (!validId(req.params.id)) {
      res.status(400).json({ error: 'รหัสคดีไม่ถูกต้อง' });
      return;
    }
    const input = caseInput.partial().parse(req.body);
    const caseItem = await CaseModel.findOne({ _id: req.params.id, deletedAt: null, ...accessFilter(user) }).select('ownerId');
    if (!caseItem) {
      notFound(res);
      return;
    }

    const isOwner = String(caseItem.ownerId) === user.id;
    const { data, ...fields } = input;
    const update: Record<string, unknown> = {};

    if (isOwner) {
      Object.assign(update, fields);
    } else if (Object.keys(fields).length > 0) {
      res.status(403).json({ error: 'ลูกความแก้ไขข้อมูลหลักของคดีไม่ได้' });
      return;
    }

    for (const [key, value] of Object.entries(cleanData(data))) {
      if (!isOwner && !CLIENT_WRITABLE_DATA_KEYS.has(key)) {
        res.status(403).json({ error: 'ลูกความแก้ไขได้เฉพาะเอกสารและเช็กลิสต์' });
        return;
      }
      update[`data.${key}`] = value;
    }

    const updated = await CaseModel.findByIdAndUpdate(
      caseItem._id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();
    res.json({ case: serializeCase(updated!, user) });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/restore', async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = req.user!;
    if (!validId(req.params.id)) {
      res.status(400).json({ error: 'รหัสคดีไม่ถูกต้อง' });
      return;
    }
    const caseItem = await CaseModel.findOneAndUpdate(
      { _id: req.params.id, ownerId: user.id, deletedAt: { $ne: null } },
      { $set: { deletedAt: null } },
      { new: true }
    ).lean();
    if (!caseItem) {
      notFound(res);
      return;
    }
    const messages = await loadMessagesByCase([caseItem._id]);
    res.json({ case: serializeCase(caseItem, user, messages.get(String(caseItem._id))) });
  } catch (error) {
    next(error);
  }
});

// Moves a case to the trash; `?permanent=1` erases a trashed case and its messages.
router.delete('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = req.user!;
    if (!validId(req.params.id)) {
      res.status(400).json({ error: 'รหัสคดีไม่ถูกต้อง' });
      return;
    }

    if (req.query.permanent === '1') {
      const deleted = await CaseModel.findOneAndDelete({ _id: req.params.id, ownerId: user.id, deletedAt: { $ne: null } });
      if (!deleted) {
        notFound(res, 'ไม่พบคดีในถังขยะ');
        return;
      }
      await MessageModel.deleteMany({ caseId: deleted._id });
      res.status(204).send();
      return;
    }

    const caseItem = await CaseModel.findOneAndUpdate(
      { _id: req.params.id, ownerId: user.id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    ).lean();
    if (!caseItem) {
      notFound(res, 'ไม่พบคดีหรือไม่มีสิทธิ์ลบ');
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post('/:id/messages', async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = req.user!;
    if (!validId(req.params.id)) {
      res.status(400).json({ error: 'รหัสคดีไม่ถูกต้อง' });
      return;
    }
    const input = messageInput.parse(req.body);
    const caseItem = await CaseModel.exists({ _id: req.params.id, deletedAt: null, ...accessFilter(user) });
    if (!caseItem) {
      notFound(res);
      return;
    }
    const message = await MessageModel.create({
      caseId: req.params.id,
      senderId: user.id,
      senderName: user.name,
      role: user.role,
      text: input.text,
    });
    res.status(201).json({ message: serializeMessage(message.toObject()) });
  } catch (error) {
    next(error);
  }
});

export default router;
