import { Router } from 'express';

import { validateRequest } from '../../middlewares/validateRequest.js';
import { settingsAdminController } from '../../controllers/admin/settings.controller.js';
import { settingsUpsertSchema } from '../../validators/admin/settings.validator.js';

export const settingsAdminRouter = Router();

settingsAdminRouter.get('/', settingsAdminController.get);
settingsAdminRouter.put('/', validateRequest({ body: settingsUpsertSchema }), settingsAdminController.upsert);

