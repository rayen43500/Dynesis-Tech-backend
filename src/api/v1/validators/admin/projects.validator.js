import { z } from 'zod';
import { localizedStringOptionalSchema } from '../../../../shared/validators/localized.js';
import { objectIdSchema } from '../../../../shared/validators/objectId.js';

export const projectsIdParamSchema = z.object({ id: objectIdSchema });

const milestoneSchema = z.object({
  title: z.string().optional(),
  dueDate: z.string().datetime().optional().nullable(),
  status: z.string().optional(),
  notes: z.string().optional()
});

const roadmapStageSchema = z.object({
  title: z.string().optional(),
  order: z.number().int().optional(),
  completed: z.boolean().optional()
});

const projectCreateSchema = z.object({
  clientId: objectIdSchema,
  title: z.string().min(1),
  status: z.enum(['active', 'paused', 'completed', 'canceled']).optional(),
  milestones: z.array(milestoneSchema).optional(),
  roadmap: z.array(roadmapStageSchema).optional(),
  consultationNotes: z.string().optional()
});

export const projectUpdateSchema = projectCreateSchema.partial();
export const projectCreateSchemaExport = projectCreateSchema;

