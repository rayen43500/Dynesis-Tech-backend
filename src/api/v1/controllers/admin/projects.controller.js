import mongoose from 'mongoose';

import { Project } from '../../../../modules/projects/models/Project.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { parsePagination } from '../../../../shared/http/pagination.js';

export const projectsAdminController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (req.query.clientId) filter.clientId = req.query.clientId;
    if (req.query.status) filter.status = req.query.status;

    const [items, total] = await Promise.all([
      Project.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
      Project.countDocuments(filter)
    ]);

    return sendSuccess(res, { data: items, meta: { page, limit, total } });
  }),

  getById: asyncHandler(async (req, res) => {
    const doc = await Project.findById(req.params.id).lean();
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Project not found' });
    return sendSuccess(res, { data: doc });
  }),

  create: asyncHandler(async (req, res) => {
    const doc = await Project.create(req.body);
    return sendSuccess(res, { data: doc });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid id' });
    }

    const updated = await Project.findByIdAndUpdate(id, { $set: req.body }, { new: true }).lean();
    if (!updated) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Project not found' });
    return sendSuccess(res, { data: updated });
  })
};

