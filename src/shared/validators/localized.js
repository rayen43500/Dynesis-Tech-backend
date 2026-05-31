import { z } from 'zod';

export const localizedStringSchema = z
  .object({
    en: z.string().optional(),
    fr: z.string().optional()
  })
  .refine((v) => (v.en && v.en.trim().length > 0) || (v.fr && v.fr.trim().length > 0), {
    message: 'At least one of en/fr must be provided'
  });

export const localizedStringOptionalSchema = z.object({
  en: z.string().optional(),
  fr: z.string().optional()
});

