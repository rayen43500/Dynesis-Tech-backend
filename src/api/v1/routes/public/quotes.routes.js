import { Router } from 'express';

import { validateRequest } from '../../middlewares/validateRequest.js';
import { quotesPublicController } from '../../controllers/public/quotes.controller.js';
import { quoteCreateSchema } from '../../validators/quotes.validator.js';

export const quotesPublicRouter = Router();

quotesPublicRouter.post('/', validateRequest({ body: quoteCreateSchema }), quotesPublicController.create);
