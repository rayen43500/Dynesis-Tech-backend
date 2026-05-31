import { z } from 'zod';

export const createInvitationSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'client'])
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(10),
  email: z.string().email().optional(),
  password: z.string().min(8),
  displayName: z.string().max(100).optional()
});

