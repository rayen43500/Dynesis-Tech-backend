import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';

import { mediaService } from '../../../../modules/media/services/media.service.js';
import { MediaAsset } from '../../../../modules/media/models/MediaAsset.model.js';

const ALLOWED_FOLDERS = [
  'developers/profile',
  'developers/portfolio',
  'homepage',
  'services',
  'inquiries',
  'branding'
];

function assertAllowedFolder(folder) {
  // MVP: allow exact prefix matches only.
  const normalized = String(folder).replace(/^\//, '').trim();
  const ok = ALLOWED_FOLDERS.some((f) => normalized === f || normalized.startsWith(`${f}/`));
  if (!ok) throw new ApiError({ statusCode: 400, code: 'MEDIA_INVALID_FOLDER', message: 'Folder not allowed' });
}

export const mediaAdminController = {
  signUpload: asyncHandler(async (req, res) => {
    const { folder, resourceType } = req.body;
    assertAllowedFolder(folder);

    const result = await mediaService.signUpload({ folder, resourceType });
    return sendSuccess(res, { data: result });
  }),

  createAsset: asyncHandler(async (req, res) => {
    const actor = req.user?.userId || null;
    const payload = {
      resourceType: req.body.resourceType,
      folder: req.body.folder,
      cloudinaryPublicId: req.body.cloudinaryPublicId,
      secureUrl: req.body.secureUrl || '',
      altText: req.body.altText || '',
      tags: req.body.tags || [],
      uploadedBy: actor
    };

    assertAllowedFolder(payload.folder);

    const asset = await MediaAsset.create(payload);
    return sendSuccess(res, { data: asset });
  })
};

