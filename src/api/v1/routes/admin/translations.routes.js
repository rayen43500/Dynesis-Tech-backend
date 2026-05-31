import { Router } from 'express';

import { validateRequest } from '../../middlewares/validateRequest.js';
import { translationsAdminController } from '../../controllers/admin/translations.controller.js';
import { translationsQuerySchema, translationCreateSchema, translationUpdateSchema } from '../../validators/admin/translations.validator.js';

import { objectIdSchema } from '../../../../shared/validators/objectId.js';

export const translationsAdminRouter = Router();

translationsAdminRouter.get('/', validateRequest({ query: translationsQuerySchema }), translationsAdminController.list);
translationsAdminRouter.post('/upsert', validateRequest({ body: translationCreateSchema }), translationsAdminController.upsert);
translationsAdminRouter.get('/:id', validateRequest({ params: objectIdSchema }), translationsAdminController.getById);

