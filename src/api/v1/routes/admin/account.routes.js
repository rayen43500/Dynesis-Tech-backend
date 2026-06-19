import { Router } from 'express';

import { userPhotoUpload } from '../../../../config/upload.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { updateAdminAccountSchema, changeAdminPasswordSchema } from '../../validators/admin/account.validator.js';
import { adminAccountController } from '../../controllers/admin/account.controller.js';

export const adminAccountRouter = Router();

adminAccountRouter.patch(
  '/',
  userPhotoUpload.single('photo'),
  validateRequest({ body: updateAdminAccountSchema }),
  adminAccountController.update
);

adminAccountRouter.patch(
  '/password',
  validateRequest({ body: changeAdminPasswordSchema }),
  adminAccountController.changePassword
);
