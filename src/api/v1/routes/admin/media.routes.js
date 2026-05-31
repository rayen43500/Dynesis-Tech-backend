import { Router } from 'express';

import { validateRequest } from '../../middlewares/validateRequest.js';
import { mediaAdminController } from '../../controllers/admin/media.controller.js';
import { adminSignUploadSchema, adminMediaAssetCreateSchema } from '../../validators/admin/media.validator.js';

export const mediaAdminRouter = Router();

mediaAdminRouter.post('/sign-upload', validateRequest({ body: adminSignUploadSchema }), mediaAdminController.signUpload);
mediaAdminRouter.post('/assets', validateRequest({ body: adminMediaAssetCreateSchema }), mediaAdminController.createAsset);

