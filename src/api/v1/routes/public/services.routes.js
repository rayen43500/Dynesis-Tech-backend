import { Router } from 'express';

import { servicesPublicController } from '../../controllers/public/services.controller.js';

export const servicesPublicRouter = Router();

servicesPublicRouter.get('/', servicesPublicController.list);
