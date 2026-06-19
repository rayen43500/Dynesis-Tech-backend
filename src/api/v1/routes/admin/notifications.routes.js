import { Router } from 'express';

import { validateRequest } from '../../middlewares/validateRequest.js';
import { quoteNotificationsQuerySchema } from '../../validators/quotes.validator.js';
import { notificationsAdminController } from '../../controllers/admin/notifications.controller.js';

export const notificationsAdminRouter = Router();

notificationsAdminRouter.get('/', validateRequest({ query: quoteNotificationsQuerySchema }), notificationsAdminController.summary);
