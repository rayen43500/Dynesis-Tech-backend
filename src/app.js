import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { getAllowedOrigins } from './config/env.js';
import { errorHandler } from './api/v1/middlewares/errorHandler.js';
import { requestId } from './api/v1/middlewares/requestId.js';
import { uploadsRoot } from './config/upload.js';

import { apiV1Router } from './api/v1/routes/index.js';
import { quotesPublicRouter } from './api/v1/routes/public/quotes.routes.js';
import { contactPublicRouter } from './api/v1/routes/public/contact.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(helmet());
  // Stripe webhooks require the raw body for signature verification.
  app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));

  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(mongoSanitize());

  const allowedOrigins = getAllowedOrigins();
  app.use(
    cors({
      origin(origin, cb) {
        // Allow server-to-server or non-browser tooling
        if (!origin) return cb(null, true);
        if (allowedOrigins.includes(origin)) return cb(null, true);
        return cb(null, false);
      },
      credentials: true
    })
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.use(requestId);

  app.get('/health', (_req, res) =>
    res.status(200).json({
      ok: true,
      env: process.env.NODE_ENV || 'development',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    })
  );

  app.use(
    '/uploads',
    (_req, res, next) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      next();
    },
    express.static(uploadsRoot)
  );

  app.use('/api/v1', apiV1Router);
  app.use('/api/quotes', quotesPublicRouter);
  app.use('/api/contact', contactPublicRouter);

  // Central error handler (must be last)
  app.use(errorHandler);

  return app;
}

