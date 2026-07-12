import { ChatRoom } from '../models/ChatRoom.model.js';
import { ChatMessage } from '../models/ChatMessage.model.js';
import { ApiError } from '../../../shared/http/apiErrors.js';

export const messagingService = {
  async listRooms(userId) {
    return ChatRoom.find({ participantIds: userId }).sort({ lastMessageAt: -1, updatedAt: -1 }).lean();
  },

  async getOrCreateDirectRoom(userId, otherUserId) {
    const existing = await ChatRoom.findOne({
      type: 'direct',
      participantIds: { $all: [userId, otherUserId], $size: 2 }
    });
    if (existing) return existing;

    return ChatRoom.create({
      type: 'direct',
      participantIds: [userId, otherUserId],
      name: ''
    });
  },

  async listMessages(roomId, userId) {
    const room = await ChatRoom.findById(roomId).lean();
    if (!room || !room.participantIds.some((id) => String(id) === String(userId))) {
      throw new ApiError({ statusCode: 403, code: 'FORBIDDEN', message: 'Forbidden' });
    }
    return ChatMessage.find({ roomId }).sort({ createdAt: 1 }).limit(200).lean();
  },

  async sendMessage({ roomId, senderId, body }) {
    const room = await ChatRoom.findById(roomId);
    if (!room || !room.participantIds.some((id) => String(id) === String(senderId))) {
      throw new ApiError({ statusCode: 403, code: 'FORBIDDEN', message: 'Forbidden' });
    }

    const message = await ChatMessage.create({ roomId, senderId, body });
    room.lastMessageAt = new Date();
    await room.save();
    return message.toObject();
  }
};
