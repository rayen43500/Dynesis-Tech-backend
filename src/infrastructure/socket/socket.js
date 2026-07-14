import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

import { AUTH } from '../../config/auth.js';
import { messagingService } from '../../modules/messaging/services/messaging.service.js';

export function initSocket(server, allowedOrigins = []) {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins.length ? allowedOrigins : true,
      credentials: true
    },
    path: '/socket.io'
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) return next(new Error('Unauthorized'));
      const payload = jwt.verify(token, AUTH.jwt.accessSecret);
      socket.userId = payload.userId;
      socket.userRole = payload.role;
      return next();
    } catch {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user:${socket.userId}`);

    socket.on('join_room', (roomId) => {
      socket.join(`room:${roomId}`);
    });

    socket.on('send_message', async ({ roomId, body }) => {
      if (!roomId || !body?.trim()) return;
      const message = await messagingService.sendMessage({
        roomId,
        senderId: socket.userId,
        body: body.trim()
      });
      io.to(`room:${roomId}`).emit('message', message);
      const room = message.roomId;
      io.to(`user:${socket.userId}`).emit('room_updated', { roomId: room });
    });
  });

  return io;
}
