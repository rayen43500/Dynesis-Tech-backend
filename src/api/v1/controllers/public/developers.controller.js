import mongoose from 'mongoose';

import { DeveloperProfile } from '../../../../modules/developers/models/DeveloperProfile.model.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { mapDirectoryItem, mapProfile } from '../../../../shared/developers/mapDeveloper.js';

export const developersPublicController = {
  list: async (req, res) => {
    const lang = req.query.lang || 'en';

    const items = await DeveloperProfile.find({ visible: true }).sort({ ordering: 1, createdAt: -1 }).lean();

    return sendSuccess(res, {
      data: items.map((dev) => mapDirectoryItem(dev, lang))
    });
  },

  getById: async (req, res) => {
    const lang = req.query.lang || 'en';
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid id' });
    }

    const dev = await DeveloperProfile.findOne({ _id: id, visible: true }).lean();
    if (!dev) {
      throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Developer not found' });
    }

    return sendSuccess(res, {
      data: mapProfile(dev, lang)
    });
  }
};
