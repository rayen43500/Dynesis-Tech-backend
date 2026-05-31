import { Router } from 'express';

import { validateRequest } from '../../middlewares/validateRequest.js';
import { servicesAdminController } from '../../controllers/admin/services.controller.js';
import { servicesIdParamSchema, serviceCreateSchema, serviceUpdateSchema } from '../../validators/admin/services.validator.js';

export const servicesAdminRouter = Router();

servicesAdminRouter.get('/', servicesAdminController.list);
servicesAdminRouter.post('/', validateRequest({ body: serviceCreateSchema }), servicesAdminController.create);

servicesAdminRouter.get('/:id', validateRequest({ params: servicesIdParamSchema }), servicesAdminController.getById);
servicesAdminRouter.patch('/:id', validateRequest({ params: servicesIdParamSchema, body: serviceUpdateSchema }), servicesAdminController.update);

