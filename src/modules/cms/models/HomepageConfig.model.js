import mongoose from 'mongoose';

const LocalizedString = new mongoose.Schema(
  {
    en: { type: String, default: '' },
    fr: { type: String, default: '' }
  },
  { _id: false }
);

const HomepageCTA = new mongoose.Schema(
  {
    label: { type: LocalizedString, required: true },
    href: { type: String, default: '' },
    actionType: { type: String, default: 'link', enum: ['link', 'modal', 'scroll'] }
  },
  { _id: false }
);

const FeaturedDeveloper = new mongoose.Schema(
  {
    developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeveloperProfile', required: true, index: true },
    accentColor: { type: String, default: '' },
    glowColor: { type: String, default: '' },
    gradientTheme: { type: String, default: '' },
    featuredMode: { type: String, default: 'default' },
    heroShortDescription: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
    highlightedExpertise: { type: String, default: '' },
    cta: { type: HomepageCTA, default: null }
  },
  { _id: false }
);

const HeroTheme = new mongoose.Schema(
  {
    accentColor: { type: String, default: '' },
    glowColor: { type: String, default: '' },
    gradientTheme: { type: String, default: '' },
    featuredMode: { type: String, default: 'default' },
    floatingExpertiseTags: { type: [String], default: [] }
  },
  { _id: false }
);

const HomepageConfigSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true, index: true },

    hero: {
      title: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
      subtitle: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
      description: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
      ctas: { type: [HomepageCTA], default: [] },
      theme: { type: HeroTheme, default: () => ({}) }
    },

    accentTheme: { type: HeroTheme, default: () => ({}) },

    featuredDevelopers: { type: [FeaturedDeveloper], default: [] },

    ordering: { type: Number, default: 0 },
    visible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Singleton pattern (single homepage config doc). Helps enforce ordering/visibility.
HomepageConfigSchema.index({ ordering: 1 });

export const HomepageConfig = mongoose.model('HomepageConfig', HomepageConfigSchema);

