import { Message } from '../../../../modules/messages/models/Message.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';

function mapClientMessage(doc) {
  return {
    _id: doc._id?.toString?.() ?? String(doc._id),
    name: doc.name || '',
    email: doc.email || '',
    phone: doc.phone || '',
    company: doc.company || '',
    subject: doc.subject || '',
    message: doc.message || '',
    status: doc.status || 'new',
    adminReply: doc.adminReply || '',
    adminRepliedAt: doc.adminRepliedAt || null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export const clientMessagesController = {
  list: asyncHandler(async (req, res) => {
    const items = await Message.find({ userId: req.user.userId }).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, { data: items.map(mapClientMessage) });
  })
};
