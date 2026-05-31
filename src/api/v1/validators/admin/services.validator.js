import { z } from 'zod';

import { localizedStringOptionalSchema } from '../../../../shared/validators/localized.js';
import { objectIdSchema } from '../../../../shared/validators/objectId.js';

const localizedOptional = localizedStringOptionalSchema;

const mediaIconSchema = z.object({
  assetId: objectIdSchema.optional(),
  cloudinaryPublicId: z.string().optional(),
  secureUrl: z.string().optional()
});

const serviceCreateSchema = z.object({
  title: localizedOptional.optional(),
  shortDescription: localizedOptional.optional(),

  supportingTags: z.array(z.string()).optional(),

  highlight: z.boolean().optional(),
  visible: z.boolean().optional(),
  ordering: z.number().int().optional(),

  icon: mediaIconSchema.optional(),

  cta: z
    .object({
      label: localizedOptional.optional(),
      href: z.string().min(1).optional(),
      actionType: z.enum(['link', 'modal', 'scroll']).optional()
    })
    .optional()
});

export const servicesIdParamSchema = z.object({ id: objectIdSchema });
export { serviceCreateSchema };

export const serviceUpdateSchema = serviceCreateSchema.partial();

