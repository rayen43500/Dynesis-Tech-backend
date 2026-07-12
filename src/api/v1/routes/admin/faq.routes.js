import { Router } from 'express';

import { faqAdminController } from '../../controllers/faq.controller.js';

export const faqAdminRouter = Router();

faqAdminRouter.get('/', faqAdminController.list);
faqAdminRouter.post('/', faqAdminController.create);
faqAdminRouter.patch('/:id', faqAdminController.update);
faqAdminRouter.delete('/:id', faqAdminController.remove);
