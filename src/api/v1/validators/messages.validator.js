import { z } from 'zod';

export const contactCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1)
});

export const messageIdParamSchema = z.object({
  id: z.string().min(1)
});

export const messageUpdateSchema = z.object({
  status: z.enum(['new', 'read', 'replied']).optional()
});

export const messageReplySchema = z.object({
  reply: z.string().min(1)
});
