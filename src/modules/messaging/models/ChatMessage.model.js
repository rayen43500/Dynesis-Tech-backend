import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true, index: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    body: { type: String, default: '' },
    attachments: { type: [String], default: [] },
    readBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    reactions: {
      type: [{ emoji: String, userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
      default: []
    }
  },
  { timestamps: true }
);

ChatMessageSchema.index({ roomId: 1, createdAt: -1 });

export const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
