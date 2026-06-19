import mongoose from 'mongoose';

const LocalizedString = new mongoose.Schema(
  {
    en: { type: String, default: '' },
    fr: { type: String, default: '' }
  },
  { _id: false }
);

const CoordinatesSchema = new mongoose.Schema(
  {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null }
  },
  { _id: false }
);

const OfficeLocationSchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },
    address: { type: String, default: '' },
    coordinates: { type: CoordinatesSchema, default: () => ({}) }
  },
  { _id: false }
);

const ThemeModeSchema = new mongoose.Schema(
  {
    accent: { type: String, default: '' },
    accent2: { type: String, default: '' },
    bg: { type: String, default: '' },
    surface: { type: String, default: '' },
    text: { type: String, default: '' },
    muted: { type: String, default: '' },
    border: { type: String, default: '' }
  },
  { _id: false }
);

const HomeThemeSchema = new mongoose.Schema(
  {
    accent: { type: String, default: '' },
    accentLight: { type: String, default: '' },
    heroCardBg: { type: String, default: '' },
    btnPrimary: { type: String, default: '' },
    btnSecondary: { type: String, default: '' },
    check: { type: String, default: '' },
    star: { type: String, default: '' }
  },
  { _id: false }
);

const TestimonialItemSchema = new mongoose.Schema(
  {
    quote: { type: LocalizedString, default: () => ({}) },
    name: { type: LocalizedString, default: () => ({}) },
    role: { type: LocalizedString, default: () => ({}) }
  },
  { _id: false }
);

const ScrollTabSchema = new mongoose.Schema(
  {
    label: { type: LocalizedString, default: () => ({}) },
    tag: { type: LocalizedString, default: () => ({}) },
    headline1: { type: LocalizedString, default: () => ({}) },
    headline2: { type: LocalizedString, default: () => ({}) },
    c1: { type: LocalizedString, default: () => ({}) },
    c2: { type: LocalizedString, default: () => ({}) },
    c3: { type: LocalizedString, default: () => ({}) },
    c4: { type: LocalizedString, default: () => ({}) },
    person: { type: LocalizedString, default: () => ({}) },
    role: { type: LocalizedString, default: () => ({}) },
    image: { type: String, default: '' },
    tags: { type: [String], default: [] },
    learnHref: { type: String, default: '' }
  },
  { _id: false }
);

const PlatformSettingsSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, default: 'platform', unique: true, index: true },

    branding: {
      siteName: { type: LocalizedString, default: () => ({}) },
      tagline: { type: LocalizedString, default: () => ({}) },
      logoUrl: { type: String, default: '' },
      logoMark: { type: String, default: 'D' }
    },

    contact: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: LocalizedString, default: () => ({}) },
      hours: { type: LocalizedString, default: () => ({}) },
      about: { type: LocalizedString, default: () => ({}) },
      locations: { type: [OfficeLocationSchema], default: [] }
    },

    social: {
      x: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' }
    },

    copyright: { type: LocalizedString, default: () => ({}) },

    theme: {
      defaultMode: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      global: {
        light: { type: ThemeModeSchema, default: () => ({}) },
        dark: { type: ThemeModeSchema, default: () => ({}) }
      },
      home: { type: HomeThemeSchema, default: () => ({}) }
    },

    homeContent: {
      hero: {
        headline1: { type: LocalizedString, default: () => ({}) },
        headline2: { type: LocalizedString, default: () => ({}) },
        subheading: { type: LocalizedString, default: () => ({}) },
        feature1: { type: LocalizedString, default: () => ({}) },
        feature2: { type: LocalizedString, default: () => ({}) },
        feature3: { type: LocalizedString, default: () => ({}) },
        heroImage: { type: String, default: '' },
        techStack: { type: [String], default: [] },
        ctaPrimary: { type: LocalizedString, default: () => ({}) },
        ctaPrimaryHref: { type: String, default: '/contact' },
        ctaSecondary: { type: LocalizedString, default: () => ({}) },
        ctaSecondaryHref: { type: String, default: '/work-with-us' },
        matchBadge: { type: LocalizedString, default: () => ({}) },
        featuredName: { type: LocalizedString, default: () => ({}) },
        featuredRole: { type: LocalizedString, default: () => ({}) }
      },
      ratings: {
        score: { type: String, default: '4.7' },
        reviewCount: { type: LocalizedString, default: () => ({}) }
      },
      testimonials: {
        heading: { type: LocalizedString, default: () => ({}) },
        items: { type: [TestimonialItemSchema], default: [] }
      },
      intro: {
        line1: { type: LocalizedString, default: () => ({}) },
        line2: { type: LocalizedString, default: () => ({}) }
      },
      scrollTabs: {
        design: { type: ScrollTabSchema, default: () => ({}) },
        development: { type: ScrollTabSchema, default: () => ({}) },
        transformation: { type: ScrollTabSchema, default: () => ({}) }
      }
    },

    consultationAvailability: {
      enabled: { type: Boolean, default: true },
      timezone: { type: String, default: 'UTC' },
      config: { type: Object, default: {} }
    },

    // Legacy — kept for backward compatibility
    hero: {
      headline: { type: LocalizedString, default: () => ({}) },
      subheadline: { type: LocalizedString, default: () => ({}) }
    }
  },
  { timestamps: true }
);

export const PlatformSettings = mongoose.model('PlatformSettings', PlatformSettingsSchema);
