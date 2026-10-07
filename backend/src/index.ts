import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { ZodError } from 'zod';
import { connectToMongoDB, isMongoDBConnected } from './db/mongodb.ts';
import authRoutes from './routes/auth.ts';
import caseRoutes from './routes/cases.ts';
import aiRoutes from './routes/ai.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../../dist');

const app = express();
const PORT = Number(process.env.BACKEND_PORT || process.env.PORT) || 8787;
const isProduction = process.env.NODE_ENV === 'production';

// Case data can carry Mind Map images and attachments as data URLs.
app.use(express.json({ limit: '12mb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, database: isMongoDBConnected() ? 'connected' : 'disconnected' });
});

// Auth and case APIs need MongoDB; respond clearly instead of hanging when it is not configured.
const requireDatabase: express.RequestHandler = (_req, res, next) => {
  if (!isMongoDBConnected()) {
    res.status(503).json({ error: 'ยังไม่ได้เชื่อมต่อฐานข้อมูล (ตั้งค่า MONGODB_URI)' });
    return;
  }
  next();
};

app.use('/api/auth', requireDatabase, authRoutes);
app.use('/api/cases', requireDatabase, caseRoutes);
app.use('/api/ai', aiRoutes);

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'ไม่พบ API ที่ร้องขอ' });
});

// In production the backend also serves the built frontend from dist/.
if (isProduction && fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: 'ข้อมูลไม่ถูกต้อง: ' + error.issues.map((issue) => issue.path.join('.') || issue.message).join(', ') });
    return;
  }
  if ((error as { type?: string })?.type === 'entity.too.large') {
    res.status(413).json({ error: 'ข้อมูลมีขนาดใหญ่เกินไป (ไฟล์แนบรวมต้องไม่เกิน 12MB)' });
    return;
  }
  console.error('Unhandled API error:', error);
  res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
});

async function startServer() {
  if (process.env.MONGODB_URI) {
    try {
      await connectToMongoDB();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Unable to connect to MongoDB:', error);
    }
  } else {
    console.warn('MONGODB_URI is not set: /api/auth and /api/cases will return 503');
  }

  app.listen(PORT, () => {
    console.log(`CASELINK backend running on http://localhost:${PORT} (production: ${isProduction})`);
  });
}

startServer().catch((error) => {
  console.error('Unable to start CASELINK backend:', error);
  process.exitCode = 1;
});
