import { Router } from 'express';

import { settingsPublicController } from '../../controllers/admin/settings.controller.js';

export const settingsPublicRouter = Router();

settingsPublicRouter.get('/', settingsPublicController.get);
