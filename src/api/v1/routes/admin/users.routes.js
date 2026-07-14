import { Router } from 'express';

import { usersAdminController } from '../../controllers/admin/users.controller.js';

export const usersAdminRouter = Router();

usersAdminRouter.get('/', usersAdminController.list);
usersAdminRouter.get('/:id', usersAdminController.getById);
usersAdminRouter.patch('/:id', usersAdminController.update);
usersAdminRouter.delete('/:id', usersAdminController.remove);
usersAdminRouter.post('/invite', usersAdminController.invite);
