import { asyncHandler } from '../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../shared/http/apiResponse.js';
import { messagingService } from '../../../modules/messaging/services/messaging.service.js';

export const messagingController = {
  listRooms: asyncHandler(async (req, res) => {
    const rooms = await messagingService.listRooms(req.user.userId);
    return sendSuccess(res, { data: rooms });
  }),

  listMessages: asyncHandler(async (req, res) => {
    const messages = await messagingService.listMessages(req.params.roomId, req.user.userId);
    return sendSuccess(res, { data: messages });
  }),

  sendMessage: asyncHandler(async (req, res) => {
    const message = await messagingService.sendMessage({
      roomId: req.params.roomId,
      senderId: req.user.userId,
      body: req.body.body
    });
    return sendSuccess(res, { data: message });
  })
};
