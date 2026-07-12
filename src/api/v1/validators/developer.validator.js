import { z } from 'zod';

import { objectIdSchema } from '../../../shared/validators/objectId.js';

export const developerIdParamSchema = z.object({ id: objectIdSchema });

export const taskStatusSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'blocked', 'review', 'testing', 'done'])
});

export const taskCommentSchema = z.object({
  body: z.string().trim().min(1).max(3000)
});

export const timeEntrySchema = z.object({
  projectId: objectIdSchema.optional(),
  taskId: objectIdSchema.optional(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date().optional(),
  durationMinutes: z.coerce.number().int().min(1).max(24 * 60),
  note: z.string().trim().max(1000).optional(),
  source: z.enum(['timer', 'manual']).optional()
});

export const leaveRequestSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  reason: z.string().trim().max(1000).optional()
});
