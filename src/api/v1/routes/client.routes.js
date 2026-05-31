import { Router } from 'express';

import { authJwt } from '../middlewares/authJwt.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { clientQuotesRouter } from './client/quotes.routes.js';

export const clientRouter = Router();

clientRouter.use(authJwt);
clientRouter.use(requireRoles(['client']));

clientRouter.use('/quotes', clientQuotesRouter);
