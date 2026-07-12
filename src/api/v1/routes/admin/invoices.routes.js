import { Router } from 'express';

import { invoicesAdminController } from '../../controllers/admin/invoices.controller.js';

export const invoicesAdminRouter = Router();

invoicesAdminRouter.get('/', invoicesAdminController.list);
invoicesAdminRouter.post('/', invoicesAdminController.create);
invoicesAdminRouter.get('/:id', invoicesAdminController.getById);
invoicesAdminRouter.patch('/:id', invoicesAdminController.update);
