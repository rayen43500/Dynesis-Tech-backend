import { Router } from 'express';

import { authJwt } from '../middlewares/authJwt.middleware.js';
import { requireAdmin, requireClient } from '../middlewares/requireAuth.middleware.js';
import { auditAdminAction } from '../middlewares/auditAdminAction.js';

import { homepageAdminRouter } from './admin/homepage.routes.js';
import { developersAdminRouter } from './admin/developers.routes.js';
import { portfoliosAdminRouter } from './admin/portfolios.routes.js';
import { servicesAdminRouter } from './admin/services.routes.js';
import { inquiriesAdminRouter } from './admin/inquiries.routes.js';
import { quotesAdminRouter } from './admin/quotes.routes.js';
import { messagesAdminRouter } from './admin/messages.routes.js';
import { notificationsAdminRouter } from './admin/notifications.routes.js';
import { clientsAdminRouter } from './admin/clients.routes.js';
import { projectsAdminRouter } from './admin/projects.routes.js';
import { translationsAdminRouter } from './admin/translations.routes.js';
import { mediaAdminRouter } from './admin/media.routes.js';
import { settingsAdminRouter } from './admin/settings.routes.js';

export const adminRouter = Router();

// Everything under /admin requires admin role.
adminRouter.use(...requireAdmin);
adminRouter.use(auditAdminAction);

adminRouter.use('/homepage', homepageAdminRouter);
adminRouter.use('/developers', developersAdminRouter);
adminRouter.use('/portfolios', portfoliosAdminRouter);
adminRouter.use('/services', servicesAdminRouter);
adminRouter.use('/inquiries', inquiriesAdminRouter);
adminRouter.use('/quotes', quotesAdminRouter);
adminRouter.use('/messages', messagesAdminRouter);
adminRouter.use('/notifications', notificationsAdminRouter);
adminRouter.use('/clients', clientsAdminRouter);
adminRouter.use('/projects', projectsAdminRouter);
adminRouter.use('/translations', translationsAdminRouter);
adminRouter.use('/media', mediaAdminRouter);
adminRouter.use('/settings', settingsAdminRouter);

