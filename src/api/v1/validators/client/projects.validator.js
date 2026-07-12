import { z } from 'zod';

export const projectIdParamSchema = z.object({
  id: z.string().min(1)
});
