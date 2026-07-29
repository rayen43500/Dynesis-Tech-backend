import mongoose from 'mongoose';

const newsletterCampaignSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    recipientCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['draft', 'sending', 'sent', 'failed'],
      default: 'draft'
    },
    sentAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const NewsletterCampaign = mongoose.model('NewsletterCampaign', newsletterCampaignSchema);
