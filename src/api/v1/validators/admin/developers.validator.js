import { z } from 'zod';
import { objectIdSchema } from '../../../../shared/validators/objectId.js';

export const developersIdParamSchema = z.object({
  id: objectIdSchema
});

export const portfolioProjectParamSchema = z.object({
  id: objectIdSchema,
  projectId: objectIdSchema
});
