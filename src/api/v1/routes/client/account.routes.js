import { Router } from 'express';

import { userPhotoUpload } from '../../../../config/upload.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { updateClientAccountSchema, changeClientPasswordSchema } from '../../validators/client/account.validator.js';
import { clientAccountController } from '../../controllers/client/account.controller.js';

export const clientAccountRouter = Router();

clientAccountRouter.patch(
  '/',
  userPhotoUpload.single('photo'),
  validateRequest({ body: updateClientAccountSchema }),
  clientAccountController.update
);

clientAccountRouter.patch(
  '/password',
  validateRequest({ body: changeClientPasswordSchema }),
  clientAccountController.changePassword
);
