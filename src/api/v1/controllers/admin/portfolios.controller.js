import mongoose from 'mongoose';

import { PortfolioProject } from '../../../../modules/developers/models/PortfolioProject.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { parsePagination } from '../../../../shared/http/pagination.js';

export const portfoliosAdminController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);

    const filter = {};
    if (req.query.developerId) {
      filter.developerId = req.query.developerId;
    }
    if (typeof req.query.featured === 'string') {
      filter.featured = req.query.featured === 'true';
    }

    const [items, total] = await Promise.all([
      PortfolioProject.find(filter)
        .sort({ ordering: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PortfolioProject.countDocuments(filter)
    ]);

    return sendSuccess(res, { data: items, meta: { page, limit, total } });
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const doc = await PortfolioProject.findById(id).lean();
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Portfolio project not found' });
    return sendSuccess(res, { data: doc });
  }),

  create: asyncHandler(async (req, res) => {
    const doc = await PortfolioProject.create(req.body);
    return sendSuccess(res, { data: doc });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid id' });
    }

    const updated = await PortfolioProject.findByIdAndUpdate(id, { $set: req.body }, { new: true }).lean();
    if (!updated) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Portfolio project not found' });
    return sendSuccess(res, { data: updated });
  })
};

