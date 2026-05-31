import { Router } from 'express';

import { clientQuotesController } from '../../controllers/client/quotes.controller.js';

export const clientQuotesRouter = Router();

clientQuotesRouter.get('/', clientQuotesController.list);
