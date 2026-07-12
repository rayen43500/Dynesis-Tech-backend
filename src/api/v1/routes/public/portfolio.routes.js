import { Router } from 'express';

import { portfolioPublicController } from '../../controllers/public/portfolio.controller.js';

export const portfolioPublicRouter = Router();

portfolioPublicRouter.get('/', portfolioPublicController.list);
portfolioPublicRouter.get('/:id', portfolioPublicController.getById);
