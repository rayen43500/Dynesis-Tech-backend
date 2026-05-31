import { z } from 'zod';

import { localizedStringSchema, localizedStringOptionalSchema } from '../../../../shared/validators/localized.js';

const localizedString = localizedStringSchema;
const localizedStringOptional = localizedStringOptionalSchema;

const homepageCTA = z.object({
  label: localizedStringOptional,
  href: z.string().min(1).optional(),
  actionType: z.enum(['link', 'modal', 'scroll']).optional()
});

const heroTheme = z.object({
  accentColor: z.string().optional(),
  glowColor: z.string().optional(),
  gradientTheme: z.string().optional(),
  featuredMode: z.string().optional(),
  floatingExpertiseTags: z.array(z.string()).optional()
});

export const homepageUpsertSchema = z.object({
  enabled: z.boolean().optional(),
  visible: z.boolean().optional(),
  ordering: z.number().int().optional(),

  hero: z
    .object({
      title: localizedStringOptional.optional(),
      subtitle: localizedStringOptional.optional(),
      description: localizedStringOptional.optional(),
      ctas: z.array(homepageCTA).optional(),
      theme: heroTheme.optional()
    })
    .optional(),

  accentTheme: heroTheme.optional(),

  featuredDevelopers: z
    .array(
      z.object({
        developerId: z.string().min(1),
        accentColor: z.string().optional(),
        glowColor: z.string().optional(),
        gradientTheme: z.string().optional(),
        featuredMode: z.string().optional(),
        heroShortDescription: localizedStringOptional.optional(),
        highlightedExpertise: z.string().optional(),
        cta: homepageCTA.optional()
      })
    )
    .optional()
});

