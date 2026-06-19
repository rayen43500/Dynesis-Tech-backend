import { Router } from 'express';

import { developersPublicRouter } from './public/developers.routes.js';
import { quotesPublicRouter } from './public/quotes.routes.js';
import { settingsPublicRouter } from './public/settings.routes.js';

export const publicRouter = Router();

publicRouter.use('/developers', developersPublicRouter);
publicRouter.use('/quotes', quotesPublicRouter);
publicRouter.use('/settings', settingsPublicRouter);

