import { Router } from 'express';

import { validateRequest } from '../../middlewares/validateRequest.js';
import { optionalAuthJwt } from '../../middlewares/optionalAuthJwt.middleware.js';
import { contactController } from '../../controllers/public/contact.controller.js';
import { contactCreateSchema } from '../../validators/messages.validator.js';

export const contactPublicRouter = Router();

contactPublicRouter.post('/', optionalAuthJwt, validateRequest({ body: contactCreateSchema }), contactController.create);
