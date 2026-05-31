import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest.js';

import { mediaController } from '../controllers/media.controller.js';
import { signUploadSchema } from '../validators/media.validator.js';

export const mediaRouter = Router();

mediaRouter.post('/sign-upload', validateRequest({ body: signUploadSchema }), mediaController.signUpload);

