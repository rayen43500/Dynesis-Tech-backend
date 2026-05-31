import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { PlatformSettings } from '../../../../modules/settings/models/PlatformSettings.model.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';

export const settingsAdminController = {
  get: asyncHandler(async (req, res) => {
    const doc = await PlatformSettings.findOne({ singletonKey: 'platform' }).lean();
    if (!doc) {
      const created = await PlatformSettings.create({ singletonKey: 'platform', contact: {}, consultationAvailability: {} });
      return sendSuccess(res, { data: created });
    }
    return sendSuccess(res, { data: doc });
  }),

  upsert: asyncHandler(async (req, res) => {
    const doc = await PlatformSettings.findOneAndUpdate(
      { singletonKey: 'platform' },
      { $set: req.body },
      { new: true, upsert: true }
    ).lean();

    if (!doc) throw new ApiError({ statusCode: 500, code: 'INTERNAL_ERROR', message: 'Failed to update settings' });
    return sendSuccess(res, { data: doc });
  })
};

