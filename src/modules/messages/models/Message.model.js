import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    isGuest: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
      index: true
    },
    adminReply: { type: String, default: '' },
    adminRepliedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', MessageSchema);
