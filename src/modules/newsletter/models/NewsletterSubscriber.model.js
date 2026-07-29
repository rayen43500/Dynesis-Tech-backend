import mongoose from 'mongoose';
import crypto from 'crypto';

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed'],
      default: 'active'
    },
    subscribedAt: {
      type: Date,
      default: Date.now
    },
    unsubscribedAt: {
      type: Date
    },
    unsubscribeToken: {
      type: String,
      default: () => crypto.randomBytes(24).toString('hex')
    },
    source: {
      type: String,
      default: 'footer'
    }
  },
  {
    timestamps: true
  }
);

export const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
