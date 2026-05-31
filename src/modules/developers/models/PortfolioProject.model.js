import mongoose from 'mongoose';

const LocalizedString = new mongoose.Schema(
  {
    en: { type: String, default: '' },
    fr: { type: String, default: '' }
  },
  { _id: false }
);

const MediaRef = new mongoose.Schema(
  {
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'MediaAsset', required: true },
    order: { type: Number, default: 0 }
  },
  { _id: false }
);

const PortfolioProjectSchema = new mongoose.Schema(
  {
    developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeveloperProfile', required: true, index: true },

    projectTitle: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
    projectOverview: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
    projectBrief: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },

    challenges: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
    solutions: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
    outcomes: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },

    technologies: { type: [String], default: [] },
    categories: { type: [String], default: [] },

    gallery: { type: [MediaRef], default: [] },

    featured: { type: Boolean, default: false, index: true },
    ordering: { type: Number, default: 0, index: true },

    // Fullscreen overlay metadata (optional)
    fullscreen: {
      headline: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
      body: { type: LocalizedString, default: () => ({ en: '', fr: '' }) }
    }
  },
  { timestamps: true }
);

PortfolioProjectSchema.index({ developerId: 1, ordering: 1 });

export const PortfolioProject = mongoose.model('PortfolioProject', PortfolioProjectSchema);

