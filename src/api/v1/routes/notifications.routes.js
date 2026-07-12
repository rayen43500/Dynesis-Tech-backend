import { Router } from 'express';

import { authJwt } from '../middlewares/authJwt.middleware.js';
import { notificationsController } from '../controllers/notifications.controller.js';

export const notificationsRouter = Router();

notificationsRouter.use(authJwt);

notificationsRouter.get('/', notificationsController.list);
notificationsRouter.patch('/:id/read', notificationsController.markRead);
notificationsRouter.post('/read-all', notificationsController.markAllRead);
