import { Router } from 'express';

import { validateRequest } from '../../middlewares/validateRequest.js';
import { homepageAdminController } from '../../controllers/admin/homepage.controller.js';
import { homepageUpsertSchema } from '../../validators/admin/homepage.validator.js';

export const homepageAdminRouter = Router();

homepageAdminRouter.get('/', homepageAdminController.get);
homepageAdminRouter.put('/', validateRequest({ body: homepageUpsertSchema }), homepageAdminController.upsert);

