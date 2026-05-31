import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(20).optional()
});

export const googleVerifySchema = z.object({
  idToken: z.string().min(20)
});

export const activationTokenSchema = z.object({
  token: z.string().min(20)
});

export const resendActivationSchema = z.object({
  email: z.string().email()
});

