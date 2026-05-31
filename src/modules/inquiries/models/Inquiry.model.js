import mongoose from 'mongoose';

const LocalizedString = new mongoose.Schema(
  {
    en: { type: String, default: '' },
    fr: { type: String, default: '' }
  },
  { _id: false }
);

const InquiryUploadedFile = new mongoose.Schema(
  {
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'MediaAsset', required: true }
  },
  { _id: false }
);

const ClientInfoSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    company: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' }
  },
  { _id: false }
);

const InquirySchema = new mongoose.Schema(
  {
    projectType: { type: String, default: '', index: true },
    budgetRange: { type: String, default: '' },
    timeline: { type: String, default: '' },

    projectDetails: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },

    uploadedFiles: { type: [InquiryUploadedFile], default: [] },

    clientInfo: { type: ClientInfoSchema, default: () => ({}) },

    status: {
      type: String,
      enum: ['new', 'contacted', 'assigned', 'consultation', 'converted', 'closed'],
      default: 'new',
      index: true
    },

    assignedConsultantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    consultationNotes: { type: String, default: '' },

    // When an inquiry is converted into a project.
    convertedProjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null }
  },
  { timestamps: true }
);

InquirySchema.index({ status: 1, createdAt: -1 });

export const Inquiry = mongoose.model('Inquiry', InquirySchema);

