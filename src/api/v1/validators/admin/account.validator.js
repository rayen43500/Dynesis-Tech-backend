import { z } from 'zod';

export const updateAdminAccountSchema = z.object({
  displayName: z.string().trim().min(1).max(100)
});

export const changeAdminPasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8)
});
