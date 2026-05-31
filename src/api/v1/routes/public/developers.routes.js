import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest.js';

import { developersPublicController } from '../../controllers/public/developers.controller.js';
import { publicDevelopersListSchema, publicDeveloperIdParamSchema } from '../../validators/public/developers.validator.js';

export const developersPublicRouter = Router();

developersPublicRouter.get('/', validateRequest({ query: publicDevelopersListSchema }), developersPublicController.list);
developersPublicRouter.get(
  '/:id',
  validateRequest({ params: publicDeveloperIdParamSchema, query: publicDevelopersListSchema }),
  developersPublicController.getById
);

