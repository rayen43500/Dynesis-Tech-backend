import { z } from 'zod';

import { localizedStringOptionalSchema } from '../../../../shared/validators/localized.js';

export const translationsQuerySchema = z.object({
  page: z.coerce.number().int().optional(),
  limit: z.coerce.number().int().optional(),
  namespace: z.string().min(1).optional(),
  key: z.string().min(1).optional(),
  lang: z.enum(['en', 'fr']).optional(),
  visible: z.enum(['true', 'false']).optional()
});

export const translationCreateSchema = z.object({
  namespace: z.string().min(1),
  key: z.string().min(1),
  values: z.object({
    en: z.string().optional(),
    fr: z.string().optional()
  }),
  visible: z.boolean().optional()
});

export const translationUpdateSchema = translationCreateSchema.partial();

