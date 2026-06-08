import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV !== 'production';

export function applySecurityMiddleware(app) {
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  if (isDev) {
    return;
  }

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        error: 'Too many requests',
        message: 'Please try again later',
      },
    })
  );

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    skipSuccessfulRequests: true,
    message: {
      success: false,
      error: 'Too many requests',
      message: 'Too many auth attempts. Try again in 15 minutes.',
    },
  });

  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/signup', authLimiter);
  app.use('/api/auth/forgot-password', authLimiter);
}

export function notFoundHandler(_req, res) {
  res.status(404).json({ success: false, error: 'Not found', message: 'Endpoint not found' });
}
