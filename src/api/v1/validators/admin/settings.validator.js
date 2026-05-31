import { z } from 'zod';
import { localizedStringOptionalSchema } from '../../../../shared/validators/localized.js';

export const settingsUpsertSchema = z.object({
  contact: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
      locations: z
        .array(
          z.object({
            label: z.string().optional(),
            address: z.string().optional(),
            coordinates: z.object({ lat: z.number().optional(), lng: z.number().optional() }).optional()
          })
        )
        .optional()
    })
    .optional(),
  consultationAvailability: z
    .object({
      enabled: z.boolean().optional(),
      timezone: z.string().optional(),
      config: z.record(z.any()).optional()
    })
    .optional(),
  hero: z
    .object({
      headline: localizedStringOptionalSchema.optional(),
      subheadline: localizedStringOptionalSchema.optional()
    })
    .optional()
});

