import { z } from 'zod';
import { localizedStringOptionalSchema } from '../../../../shared/validators/localized.js';

const localized = localizedStringOptionalSchema;
const hexColor = z.string().optional();
const hslComponents = z.string().optional();

const themeModeSchema = z
  .object({
    accent: hslComponents,
    accent2: hslComponents,
    bg: hslComponents,
    surface: hslComponents,
    text: hslComponents,
    muted: hslComponents,
    border: hslComponents
  })
  .optional();

const scrollTabSchema = z
  .object({
    label: localized.optional(),
    tag: localized.optional(),
    headline1: localized.optional(),
    headline2: localized.optional(),
    c1: localized.optional(),
    c2: localized.optional(),
    c3: localized.optional(),
    c4: localized.optional(),
    person: localized.optional(),
    role: localized.optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    learnHref: z.string().optional()
  })
  .optional();

export const settingsUpsertSchema = z.object({
  branding: z
    .object({
      siteName: localized.optional(),
      tagline: localized.optional(),
      logoUrl: z.string().optional(),
      logoMark: z.string().optional()
    })
    .optional(),
  contact: z
    .object({
      email: z.string().optional(),
      phone: z.string().optional(),
      location: localized.optional(),
      hours: localized.optional(),
      about: localized.optional(),
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
  social: z
    .object({
      x: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional()
    })
    .optional(),
  copyright: localized.optional(),
  theme: z
    .object({
      defaultMode: z.enum(['light', 'dark', 'system']).optional(),
      global: z
        .object({
          light: themeModeSchema,
          dark: themeModeSchema
        })
        .optional(),
      home: z
        .object({
          accent: hexColor,
          accentLight: hexColor,
          heroCardBg: hexColor,
          btnPrimary: hexColor,
          btnSecondary: hexColor,
          check: hexColor,
          star: hexColor
        })
        .optional()
    })
    .optional(),
  homeContent: z
    .object({
      hero: z
        .object({
          headline1: localized.optional(),
          headline2: localized.optional(),
          subheading: localized.optional(),
          feature1: localized.optional(),
          feature2: localized.optional(),
          feature3: localized.optional(),
          heroImage: z.string().optional(),
          techStack: z.array(z.string()).optional(),
          ctaPrimary: localized.optional(),
          ctaPrimaryHref: z.string().optional(),
          ctaSecondary: localized.optional(),
          ctaSecondaryHref: z.string().optional(),
          matchBadge: localized.optional(),
          featuredName: localized.optional(),
          featuredRole: localized.optional()
        })
        .optional(),
      ratings: z
        .object({
          score: z.string().optional(),
          reviewCount: localized.optional()
        })
        .optional(),
      testimonials: z
        .object({
          heading: localized.optional(),
          items: z
            .array(
              z.object({
                quote: localized.optional(),
                name: localized.optional(),
                role: localized.optional()
              })
            )
            .optional()
        })
        .optional(),
      intro: z
        .object({
          line1: localized.optional(),
          line2: localized.optional()
        })
        .optional(),
      scrollTabs: z
        .object({
          design: scrollTabSchema,
          development: scrollTabSchema,
          transformation: scrollTabSchema
        })
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
      headline: localized.optional(),
      subheadline: localized.optional()
    })
    .optional()
});

export const settingsResetSchema = z.object({
  scope: z.enum(['navbar', 'footer', 'homePage', 'sitewide'])
});
