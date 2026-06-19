import { Message } from '../../../../modules/messages/models/Message.model.js';
import { Quote } from '../../../../modules/quotes/models/Quote.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

export const notificationsAdminController = {
  summary: asyncHandler(async (req, res) => {
    const quoteFilter = { status: 'new' };

    if (req.query.since) {
      const since = new Date(req.query.since);
      if (!Number.isNaN(since.getTime())) {
        quoteFilter.createdAt = { $gt: since };
      }
    }

    const [newQuotes, newMessages] = await Promise.all([
      Quote.countDocuments(quoteFilter),
      Message.countDocuments(
        req.query.since && !Number.isNaN(new Date(req.query.since).getTime())
          ? { status: 'new', createdAt: { $gt: new Date(req.query.since) } }
          : { status: 'new' }
      )
    ]);

    return res.status(200).json({ newQuotes, newMessages });
  })
};
