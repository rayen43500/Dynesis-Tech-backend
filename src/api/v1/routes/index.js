import { Router } from 'express';

import { authRouter } from './auth.routes.js';
import { invitationsRouter } from './invitations.routes.js';
import { mediaRouter } from './media.routes.js';
import { paymentsRouter } from './payments.routes.js';
import { adminRouter } from './admin.routes.js';
import { clientRouter } from './client.routes.js';
import { developerRouter } from './developer.routes.js';
import { projectManagerRouter } from './project-manager.routes.js';
import { notificationsRouter } from './notifications.routes.js';
import { messagingRouter } from './messaging.routes.js';
import { permissionsRouter } from './permissions.routes.js';
import { docsRouter } from './docs.routes.js';
import { publicRouter } from './public.routes.js';
import { quotesPublicRouter } from './public/quotes.routes.js';

// Future domains: messaging, notifications, admin, projects, invoices...
// For now, keep these routers explicit so adding endpoints is modular and safe.

export const apiV1Router = Router();

apiV1Router.use('/auth', authRouter);
apiV1Router.use('/invitations', invitationsRouter);
apiV1Router.use('/media', mediaRouter);
apiV1Router.use('/payments', paymentsRouter);
apiV1Router.use('/admin', adminRouter);
apiV1Router.use('/client', clientRouter);
apiV1Router.use('/developer', developerRouter);
apiV1Router.use('/project-manager', projectManagerRouter);
apiV1Router.use('/notifications', notificationsRouter);
apiV1Router.use('/messaging', messagingRouter);
apiV1Router.use('/permissions', permissionsRouter);
apiV1Router.use('/docs', docsRouter);
apiV1Router.use('/public', publicRouter);
apiV1Router.use('/quotes', quotesPublicRouter);

