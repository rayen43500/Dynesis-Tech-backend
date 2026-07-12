import { Router } from 'express';

import { developersPublicRouter } from './public/developers.routes.js';
import { quotesPublicRouter } from './public/quotes.routes.js';
import { servicesPublicRouter } from './public/services.routes.js';
import { settingsPublicRouter } from './public/settings.routes.js';
import { portfolioPublicRouter } from './public/portfolio.routes.js';
import { faqPublicRouter } from './public/faq.routes.js';
import { blogPublicRouter } from './public/blog.routes.js';

export const publicRouter = Router();

publicRouter.use('/developers', developersPublicRouter);
publicRouter.use('/quotes', quotesPublicRouter);
publicRouter.use('/services', servicesPublicRouter);
publicRouter.use('/settings', settingsPublicRouter);
publicRouter.use('/portfolio', portfolioPublicRouter);
publicRouter.use('/faq', faqPublicRouter);
publicRouter.use('/blog', blogPublicRouter);
