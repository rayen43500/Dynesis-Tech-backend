import { z } from 'zod';

export const signUploadSchema = z.object({
  folder: z.string().optional(),
  resourceType: z.enum(['image', 'video', 'raw']).optional()
});

