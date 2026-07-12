import mongoose from 'mongoose';

const LocalizedString = new mongoose.Schema(
  {
    en: { type: String, default: '' },
    fr: { type: String, default: '' }
  },
  { _id: false }
);

const FAQSchema = new mongoose.Schema(
  {
    question: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
    answer: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
    category: { type: String, default: 'general', index: true },
    visible: { type: Boolean, default: true, index: true },
    ordering: { type: Number, default: 0, index: true },
    helpfulCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const FAQ = mongoose.model('FAQ', FAQSchema);
