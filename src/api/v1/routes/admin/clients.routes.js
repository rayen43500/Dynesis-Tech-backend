import { Router } from 'express';

import { validateRequest } from '../../middlewares/validateRequest.js';
import { clientsAdminController } from '../../controllers/admin/clients.controller.js';
import { clientCreateSchema, clientUpdateSchema, clientsIdParamSchema } from '../../validators/admin/clients.validator.js';

export const clientsAdminRouter = Router();

clientsAdminRouter.get('/', clientsAdminController.list);
clientsAdminRouter.post('/', validateRequest({ body: clientCreateSchema }), clientsAdminController.create);

clientsAdminRouter.get('/:id', validateRequest({ params: clientsIdParamSchema }), clientsAdminController.getById);
clientsAdminRouter.patch('/:id', validateRequest({ params: clientsIdParamSchema, body: clientUpdateSchema }), clientsAdminController.update);

