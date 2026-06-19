import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { PlatformSettings } from '../../../../modules/settings/models/PlatformSettings.model.js';
import {
  mergeWithDefaults,
  platformSettingsDefaults
} from '../../../../modules/settings/platformSettingsDefaults.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';

function stripInternalFields(doc) {
  if (!doc) return doc;
  const { _id, __v, singletonKey, createdAt, updatedAt, ...rest } = doc;
  return rest;
}

function buildResetPayload(scope) {
  switch (scope) {
    case 'navbar':
      return { branding: JSON.parse(JSON.stringify(platformSettingsDefaults.branding)) };
    case 'footer':
      return {
        contact: JSON.parse(JSON.stringify(platformSettingsDefaults.contact)),
        social: JSON.parse(JSON.stringify(platformSettingsDefaults.social)),
        copyright: JSON.parse(JSON.stringify(platformSettingsDefaults.copyright))
      };
    case 'homePage':
      return {
        homeContent: JSON.parse(JSON.stringify(platformSettingsDefaults.homeContent)),
        'theme.home': JSON.parse(JSON.stringify(platformSettingsDefaults.theme.home))
      };
    case 'sitewide':
      return {
        'theme.defaultMode': platformSettingsDefaults.theme.defaultMode,
        'theme.global': JSON.parse(JSON.stringify(platformSettingsDefaults.theme.global))
      };
    default:
      return null;
  }
}

export const settingsAdminController = {
  get: asyncHandler(async (req, res) => {
    let doc = await PlatformSettings.findOne({ singletonKey: 'platform' }).lean();
    if (!doc) {
      doc = await PlatformSettings.create({ singletonKey: 'platform' }).then((d) => d.toObject());
    }
    const merged = mergeWithDefaults(doc);
    return sendSuccess(res, { data: merged });
  }),

  upsert: asyncHandler(async (req, res) => {
    const body = { ...req.body };
    delete body.singletonKey;
    delete body._id;

    const doc = await PlatformSettings.findOneAndUpdate(
      { singletonKey: 'platform' },
      { $set: body },
      { new: true, upsert: true }
    ).lean();

    if (!doc) throw new ApiError({ statusCode: 500, code: 'INTERNAL_ERROR', message: 'Failed to update settings' });
    const merged = mergeWithDefaults(doc);
    return sendSuccess(res, { data: merged });
  }),

  reset: asyncHandler(async (req, res) => {
    const { scope } = req.body;
    const setPayload = buildResetPayload(scope);
    if (!setPayload) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid reset scope' });
    }

    const doc = await PlatformSettings.findOneAndUpdate(
      { singletonKey: 'platform' },
      { $set: setPayload },
      { new: true, upsert: true }
    ).lean();

    if (!doc) throw new ApiError({ statusCode: 500, code: 'INTERNAL_ERROR', message: 'Failed to reset settings' });
    const merged = mergeWithDefaults(doc);
    return sendSuccess(res, { data: merged });
  })
};

export const settingsPublicController = {
  get: asyncHandler(async (req, res) => {
    const doc = await PlatformSettings.findOne({ singletonKey: 'platform' }).lean();
    const merged = mergeWithDefaults(doc);
    return sendSuccess(res, { data: stripInternalFields(merged) });
  })
};
