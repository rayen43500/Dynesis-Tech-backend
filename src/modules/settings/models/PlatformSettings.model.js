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

const PlatformSettingsSchema = new mongoose.Schema(
  {
    // Singleton doc
    singletonKey: { type: String, default: 'platform', unique: true, index: true },

    contact: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      locations: { type: [OfficeLocationSchema], default: [] }
    },

    consultationAvailability: {
      enabled: { type: Boolean, default: true },
      timezone: { type: String, default: 'UTC' },
      // kept generic; can be expanded later
      config: { type: Object, default: {} }
    },

    hero: {
      headline: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
      subheadline: { type: LocalizedString, default: () => ({ en: '', fr: '' }) }
    }
  },
  { timestamps: true }
);

export const PlatformSettings = mongoose.model('PlatformSettings', PlatformSettingsSchema);

