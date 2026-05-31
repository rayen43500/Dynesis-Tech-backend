import mongoose from 'mongoose';

const LocalizedString = new mongoose.Schema(
  {
    en: { type: String, default: '' },
    fr: { type: String, default: '' }
  },
  { _id: false }
);

const ServiceCTA = new mongoose.Schema(
  {
    label: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
    href: { type: String, default: '' },
    actionType: { type: String, default: 'link', enum: ['link', 'modal', 'scroll'] }
  },
  { _id: false }
);

const ServiceIcon = new mongoose.Schema(
  {
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'MediaAsset', default: null },
    cloudinaryPublicId: { type: String, default: '' },
    secureUrl: { type: String, default: '' }
  },
  { _id: false }
);

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: LocalizedString, default: () => ({ en: '', fr: '' }), index: true },
    shortDescription: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },

    supportingTags: { type: [String], default: [] },

    icon: { type: ServiceIcon, default: () => ({}) },

    highlight: { type: Boolean, default: false },

    cta: { type: ServiceCTA, default: null },

    visible: { type: Boolean, default: true, index: true },
    ordering: { type: Number, default: 0, index: true }
  },
  { timestamps: true }
);

ServiceSchema.index({ visible: 1, ordering: 1 });

export const Service = mongoose.model('Service', ServiceSchema);

