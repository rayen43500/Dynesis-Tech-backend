import mongoose from 'mongoose';

const FeatureSchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },
    included: { type: Boolean, default: true }
  },
  { _id: false }
);

const PricingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: String, default: '' }, // "990€", "Sur devis", etc.
    priceNote: { type: String, default: '' }, // "/ projet"
    category: {
      type: String,
      enum: ['vitrine', 'blockchain', 'custom', 'other'],
      default: 'other'
    },
    features: { type: [FeatureSchema], default: [] },
    highlighted: { type: Boolean, default: false },
    badgeLabel: { type: String, default: '' }, // "Populaire", "Recommandé"
    ctaLabel: { type: String, default: 'Démarrer' },
    ctaHref: { type: String, default: '/contact' },
    ctaType: {
      type: String,
      enum: ['link', 'quote', 'contact'],
      default: 'contact'
    },
    visible: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true }
  },
  { timestamps: true }
);

PricingSchema.index({ visible: 1, order: 1 });

export const Pricing = mongoose.model('Pricing', PricingSchema);
