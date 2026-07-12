import { Service } from '../../../../modules/services/models/Service.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';

export const servicesPublicController = {
  list: asyncHandler(async (_req, res) => {
    const items = await Service.find({ visible: true }).sort({ ordering: 1 }).lean();
    return sendSuccess(res, { data: items });
  })
};
