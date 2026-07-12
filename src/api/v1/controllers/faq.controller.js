import mongoose from 'mongoose';

import { FAQ } from '../../../modules/faq/models/FAQ.model.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { ApiError } from '../../../shared/http/apiErrors.js';
import { sendSuccess } from '../../../shared/http/apiResponse.js';
import { parsePagination } from '../../../shared/http/pagination.js';

export const faqAdminController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (typeof req.query.visible === 'string') filter.visible = req.query.visible === 'true';

    const [items, total] = await Promise.all([
      FAQ.find(filter).sort({ ordering: 1 }).skip(skip).limit(limit).lean(),
      FAQ.countDocuments(filter)
    ]);
    return sendSuccess(res, { data: items, meta: { page, limit, total } });
  }),

  create: asyncHandler(async (req, res) => {
    const doc = await FAQ.create(req.body);
    return sendSuccess(res, { data: doc });
  }),

  update: asyncHandler(async (req, res) => {
    const updated = await FAQ.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    if (!updated) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'FAQ not found' });
    return sendSuccess(res, { data: updated });
  }),

  remove: asyncHandler(async (req, res) => {
    const removed = await FAQ.findByIdAndDelete(req.params.id).lean();
    if (!removed) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'FAQ not found' });
    return sendSuccess(res, { data: { ok: true } });
  })
};

export const faqPublicController = {
  list: asyncHandler(async (req, res) => {
    const filter = { visible: true };
    if (req.query.category) filter.category = req.query.category;
    const items = await FAQ.find(filter).sort({ ordering: 1 }).lean();
    return sendSuccess(res, { data: items });
  })
};
