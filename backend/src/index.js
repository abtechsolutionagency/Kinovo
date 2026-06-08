import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { seedDefaultInviteCode } from './models/InviteCode.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import { ensureUploadDir } from './controllers/profileController.js';
import { applySecurityMiddleware, notFoundHandler } from './middleware/security.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requireAuth } from './middleware/auth.js';
import { requireRole } from './middleware/roles.js';
import { asyncHandler } from './utils/asyncHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
applySecurityMiddleware(app);

ensureUploadDir();
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'running',
    service: 'kinovo-backend',
    milestone: 'M2-user-profiles',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get(
  '/api/admin/health',
  requireAuth,
  requireRole('admin'),
  asyncHandler((_req, res) => {
    res.json({ success: true, message: 'Admin access confirmed' });
  })
);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await connectDB();
  await seedDefaultInviteCode();
  app.listen(PORT, () => {
    console.log(`Kinovo backend running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
