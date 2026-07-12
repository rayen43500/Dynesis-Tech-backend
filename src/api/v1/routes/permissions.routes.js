import { Router } from 'express';

import { requireAdmin } from '../middlewares/requireAuth.middleware.js';
import { permissionsController } from '../controllers/permissions.controller.js';

export const permissionsRouter = Router();

permissionsRouter.use(...requireAdmin);

permissionsRouter.get('/permissions', permissionsController.listPermissions);
permissionsRouter.get('/roles', permissionsController.listRoles);
permissionsRouter.patch('/roles/:key', permissionsController.updateRole);
permissionsRouter.patch('/users/:userId', permissionsController.updateUserPermissions);
