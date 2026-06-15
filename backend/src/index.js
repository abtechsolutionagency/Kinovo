import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { seedDefaultAdmin } from './config/seedAdmin.js';
import { seedDefaultInviteCode } from './models/InviteCode.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import connectionRoutes from './routes/connections.js';
import groupRoutes from './routes/groups.js';
import travelRoutes from './routes/travels.js';
import adminRoutes from './routes/admin.js';
import conversationRoutes from './routes/conversations.js';
import uploadRoutes from './routes/uploads.js';
import { ensureUploadDir } from './controllers/profileController.js';
import { ensureCoverUploadDir } from './controllers/uploadController.js';
import { applySecurityMiddleware, notFoundHandler } from './middleware/security.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initSocket } from './socket/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

function createCorsMiddleware() {
  const corsOrigin = process.env.CORS_ORIGIN;

  // Allow all origins when unset or set to *
  if (!corsOrigin || corsOrigin === '*') {
    return cors({
      origin: true,
      credentials: true,
    });
  }

  const allowedOrigins = corsOrigin.split(',').map((origin) => origin.trim());

  return cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });
}

app.use(createCorsMiddleware());
app.use(express.json({ limit: '10mb' }));
applySecurityMiddleware(app);

ensureUploadDir();
ensureCoverUploadDir();
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'running',
    service: 'kinovo-backend',
    milestone: 'M6-messaging',
    realtime: 'socket.io',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/travels', travelRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/conversations', conversationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

initSocket(server);

async function start() {
  await connectDB();
  await seedDefaultInviteCode();
  await seedDefaultAdmin();
  server.listen(PORT, () => {
    console.log(`Kinovo backend running on http://localhost:${PORT}`);
    console.log(`Socket.io realtime enabled`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
