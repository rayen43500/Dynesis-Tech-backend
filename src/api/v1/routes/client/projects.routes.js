import { Router } from 'express';

import { validateRequest } from '../../middlewares/validateRequest.js';
import { clientProjectsController } from '../../controllers/client/projects.controller.js';
import { projectIdParamSchema } from '../../validators/client/projects.validator.js';

export const clientProjectsRouter = Router();

clientProjectsRouter.get('/', clientProjectsController.list);
clientProjectsRouter.get('/:id', validateRequest({ params: projectIdParamSchema }), clientProjectsController.getById);
clientProjectsRouter.get('/:id/roadmap', validateRequest({ params: projectIdParamSchema }), clientProjectsController.roadmap);
