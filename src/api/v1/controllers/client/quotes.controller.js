import { Quote } from '../../../../modules/quotes/models/Quote.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';

export const clientQuotesController = {
  list: asyncHandler(async (req, res) => {
    const items = await Quote.find({ userId: req.user.userId }).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, { data: items });
  })
};
