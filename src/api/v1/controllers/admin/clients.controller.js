import mongoose from 'mongoose';

import { User } from '../../../../modules/users/models/User.model.js';
import { ClientProfile } from '../../../../modules/clients/models/ClientProfile.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { parsePagination } from '../../../../shared/http/pagination.js';

export const clientsAdminController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (typeof req.query.visible === 'string') filter.visible = req.query.visible === 'true';

    const [items, total] = await Promise.all([
      ClientProfile.find(filter)
        .sort({ companyName: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ClientProfile.countDocuments(filter)
    ]);

    return sendSuccess(res, { data: items, meta: { page, limit, total } });
  }),

  getById: asyncHandler(async (req, res) => {
    const doc = await ClientProfile.findById(req.params.id).lean();
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Client not found' });
    return sendSuccess(res, { data: doc });
  }),

  create: asyncHandler(async (req, res) => {
    const { email, ...rest } = req.body;

    const existingUser = await User.findOne({ email });
    const user =
      existingUser ||
      (await User.create({
        email,
        role: 'client',
        displayName: rest.contactName || rest.companyName || ''
      }));

    const profile = await ClientProfile.create({
      userId: user._id,
      ...rest
    });

    return sendSuccess(res, { data: profile });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid id' });
    }

    const updated = await ClientProfile.findByIdAndUpdate(id, { $set: req.body }, { new: true }).lean();
    if (!updated) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Client not found' });
    return sendSuccess(res, { data: updated });
  })
};

