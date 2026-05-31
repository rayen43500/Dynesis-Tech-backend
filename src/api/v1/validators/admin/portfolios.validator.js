import { z } from 'zod';

import { localizedStringOptionalSchema } from '../../../../shared/validators/localized.js';
import { objectIdSchema } from '../../../../shared/validators/objectId.js';

const localizedOptional = localizedStringOptionalSchema;

const mediaRefSchema = z.object({
  assetId: objectIdSchema,
  order: z.number().int().optional()
});

const portfolioCreateSchema = z.object({
  developerId: objectIdSchema,

  projectTitle: localizedOptional.optional(),
  projectOverview: localizedOptional.optional(),
  projectBrief: localizedOptional.optional(),

  challenges: localizedOptional.optional(),
  solutions: localizedOptional.optional(),
  outcomes: localizedOptional.optional(),

  technologies: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),

  gallery: z.array(mediaRefSchema).optional(),

  featured: z.boolean().optional(),
  ordering: z.number().int().optional(),

  fullscreen: z
    .object({
      headline: localizedOptional.optional(),
      body: localizedOptional.optional()
    })
    .optional()
});

export const portfoliosIdParamSchema = z.object({ id: objectIdSchema });
export { portfolioCreateSchema };

export const portfolioUpdateSchema = portfolioCreateSchema.partial();

