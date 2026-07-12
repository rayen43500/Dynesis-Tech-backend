import { Router } from 'express';

import { faqPublicController } from '../../controllers/faq.controller.js';

export const faqPublicRouter = Router();

faqPublicRouter.get('/', faqPublicController.list);
