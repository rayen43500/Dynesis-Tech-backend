import { Notification } from '../../../modules/notifications/models/Notification.model.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../shared/http/apiResponse.js';
import { parsePagination } from '../../../shared/http/pagination.js';

export const notificationsController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { userId: req.user.userId };
    if (req.query.unreadOnly === 'true') filter.readAt = null;

    const [items, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ userId: req.user.userId, readAt: null })
    ]);

    return sendSuccess(res, { data: items, meta: { page, limit, total, unreadCount } });
  }),

  markRead: asyncHandler(async (req, res) => {
    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: { readAt: new Date() } },
      { new: true }
    ).lean();
    return sendSuccess(res, { data: updated });
  }),

  markAllRead: asyncHandler(async (req, res) => {
    await Notification.updateMany({ userId: req.user.userId, readAt: null }, { $set: { readAt: new Date() } });
    return sendSuccess(res, { data: { ok: true } });
  })
};
