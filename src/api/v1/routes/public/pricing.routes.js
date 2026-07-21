import { Router } from 'express';

import { Pricing } from '../../../../modules/pricing/models/Pricing.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';

export const pricingPublicRouter = Router();

pricingPublicRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const plans = await Pricing.find({ visible: true }).sort({ order: 1 }).lean();
    return sendSuccess(res, { data: plans });
  })
);
