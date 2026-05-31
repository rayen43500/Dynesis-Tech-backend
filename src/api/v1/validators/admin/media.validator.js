import { z } from 'zod';

import { objectIdSchema } from '../../../../shared/validators/objectId.js';

export const adminSignUploadSchema = z.object({
  folder: z.string().min(1),
  resourceType: z.enum(['image', 'video', 'raw']).default('image')
});

export const adminMediaAssetCreateSchema = z.object({
  cloudinaryPublicId: z.string().min(1),
  secureUrl: z.string().min(1).optional(),
  resourceType: z.enum(['image', 'video', 'raw']).default('image'),
  folder: z.string().min(1),
  altText: z.string().optional(),
  tags: z.array(z.string()).optional(),
  uploadedByAssetId: objectIdSchema.optional()
});

