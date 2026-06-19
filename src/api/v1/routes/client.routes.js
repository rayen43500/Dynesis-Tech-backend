import { Router } from 'express';

import { requireClient } from '../middlewares/requireAuth.middleware.js';
import { clientQuotesRouter } from './client/quotes.routes.js';
import { clientMessagesRouter } from './client/messages.routes.js';
import { clientAccountRouter } from './client/account.routes.js';

export const clientRouter = Router();

clientRouter.use(...requireClient);

clientRouter.use('/quotes', clientQuotesRouter);
clientRouter.use('/messages', clientMessagesRouter);
clientRouter.use('/account', clientAccountRouter);
