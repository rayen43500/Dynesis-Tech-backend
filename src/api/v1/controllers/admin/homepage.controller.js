import { HomepageConfig } from '../../../../modules/cms/models/HomepageConfig.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';

export const homepageAdminController = {
  get: asyncHandler(async (req, res) => {
    // MVP: use the first enabled config; if none, create a default.
    let config = await HomepageConfig.findOne({ visible: true }).sort({ ordering: 1 }).lean();

    if (!config) {
      const created = await HomepageConfig.create({
        enabled: true,
        visible: true,
        ordering: 0,
        hero: {
          title: { en: '', fr: '' },
          subtitle: { en: '', fr: '' },
          description: { en: '', fr: '' },
          ctas: [],
          theme: {}
        },
        accentTheme: {}
      });
      config = created.toObject();
    }

    return res.status(200).json({ data: config });
  }),

  upsert: asyncHandler(async (req, res) => {
    const payload = req.body;

    const config = await HomepageConfig.findOneAndUpdate(
      { visible: true },
      { $set: payload },
      { new: true, upsert: true }
    );

    if (!config) throw new ApiError({ statusCode: 500, code: 'INTERNAL_ERROR', message: 'Failed to update homepage' });

    return sendSuccess(res, { data: config });
  })
};

