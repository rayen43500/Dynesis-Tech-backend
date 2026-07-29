import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  FRONTEND_URL: z.string().min(1),
  CONTACT_EMAIL: z.string().email().optional(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Cloudinary (optional until media uploads are enabled)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_BASE_FOLDER: z.string().optional(),

  // Google auth (optional until Google login is enabled)
  GOOGLE_CLIENT_ID: z.string().optional(),

  // SMTP/Nodemailer (optional depending on environment)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_SECURE: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional()
});

export const env = envSchema.parse(process.env);

export function getAllowedOrigins() {
  // FRONTEND_URL is stored as a comma-separated list in `.env`
  return env.FRONTEND_URL.split(',').map((s) => s.trim().replace(/\/$/, ''));
}


