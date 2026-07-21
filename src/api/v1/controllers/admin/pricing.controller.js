import mongoose from 'mongoose';

import { Pricing } from '../../../../modules/pricing/models/Pricing.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';
import { parsePagination } from '../../../../shared/http/pagination.js';

export const pricingAdminController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (typeof req.query.visible === 'string') filter.visible = req.query.visible === 'true';

    const [items, total] = await Promise.all([
      Pricing.find(filter).sort({ order: 1 }).skip(skip).limit(limit).lean(),
      Pricing.countDocuments(filter)
    ]);

    return sendSuccess(res, { data: items, meta: { page, limit, total } });
  }),

  getById: asyncHandler(async (req, res) => {
    const doc = await Pricing.findById(req.params.id).lean();
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Plan not found' });
    return sendSuccess(res, { data: doc });
  }),

  create: asyncHandler(async (req, res) => {
    const doc = await Pricing.create(req.body);
    return sendSuccess(res, { data: doc });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid id' });
    }
    const updated = await Pricing.findByIdAndUpdate(id, { $set: req.body }, { new: true }).lean();
    if (!updated) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Plan not found' });
    return sendSuccess(res, { data: updated });
  }),

  remove: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid id' });
    }
    const deleted = await Pricing.findByIdAndDelete(id).lean();
    if (!deleted) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Plan not found' });
    return sendSuccess(res, { data: { ok: true } });
  })
};
