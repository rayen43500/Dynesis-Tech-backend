import mongoose from 'mongoose';

const QuoteSchema = new mongoose.Schema(
  {
    projectType: { type: String, required: true },
    budget: { type: String, required: true },
    timeline: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    company: { type: String, default: '' },
    wantsDiscoveryCall: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'proposal_sent', 'closed'],
      default: 'new',
      index: true
    },
    adminNotes: { type: String, default: '' },
    proposalSentAt: { type: Date },
    proposalSubject: { type: String, default: '' },
    proposalBody: { type: String, default: '' },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    }
  },
  { timestamps: true }
);

export const Quote = mongoose.model('Quote', QuoteSchema);
