import mongoose from 'mongoose';

const ClientProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },

    companyName: { type: String, default: '', index: true },
    contactName: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },

    officeLocations: {
      type: [String],
      default: []
    },

    visible: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

export const ClientProfile = mongoose.model('ClientProfile', ClientProfileSchema);

