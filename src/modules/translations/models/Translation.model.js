import mongoose from 'mongoose';

const TranslationSchema = new mongoose.Schema(
  {
    namespace: { type: String, required: true, index: true },
    key: { type: String, required: true, index: true },
    values: {
      en: { type: String, default: '' },
      fr: { type: String, default: '' }
    },
    visible: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

TranslationSchema.index({ namespace: 1, key: 1 }, { unique: true });

export const Translation = mongoose.model('Translation', TranslationSchema);

