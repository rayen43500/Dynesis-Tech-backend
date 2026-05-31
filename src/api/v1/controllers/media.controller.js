import { asyncHandler } from '../middlewares/asyncHandler.js';
import { mediaService } from '../../../modules/media/services/media.service.js';

export const mediaController = {
  signUpload: asyncHandler(async (req, res) => {
    const { folder, resourceType } = req.body;
    const result = await mediaService.signUpload({ folder, resourceType });
    return res.status(200).json({ data: result });
  })
};

