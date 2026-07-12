import mongoose from 'mongoose';

const ChatRoomSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    type: { type: String, enum: ['direct', 'group', 'project'], default: 'direct', index: true },
    participantIds: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [], index: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
    lastMessageAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

export const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
