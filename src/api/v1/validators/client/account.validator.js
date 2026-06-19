import { z } from 'zod';

export const updateClientAccountSchema = z.object({
  displayName: z.string().trim().min(1).max(100),
  email: z.string().trim().email()
});

export const changeClientPasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8)
});
