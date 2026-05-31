import mongoose from 'mongoose';
import { Translation } from '../../../../modules/translations/models/Translation.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';
import { parsePagination } from '../../../../shared/http/pagination.js';

export const translationsAdminController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);

    const filter = {};
    if (req.query.namespace) filter.namespace = req.query.namespace;
    if (req.query.key) filter.key = req.query.key;
    if (req.query.visible) filter.visible = req.query.visible === 'true';

    const [items, total] = await Promise.all([
      Translation.find(filter)
        .sort({ namespace: 1, key: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Translation.countDocuments(filter)
    ]);

    return sendSuccess(res, { data: items, meta: { page, limit, total } });
  }),

  upsert: asyncHandler(async (req, res) => {
    const { namespace, key, values, visible } = req.body;

    const doc = await Translation.findOneAndUpdate(
      { namespace, key },
      { $set: { values, visible: visible ?? true } },
      { new: true, upsert: true }
    ).lean();

    if (!doc) throw new ApiError({ statusCode: 500, code: 'INTERNAL_ERROR', message: 'Failed to upsert translation' });
    return sendSuccess(res, { data: doc });
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid id' });
    }

    const doc = await Translation.findById(id).lean();
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Translation not found' });
    return sendSuccess(res, { data: doc });
  })
};

