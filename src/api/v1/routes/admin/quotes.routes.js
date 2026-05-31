import { Router } from 'express';

import { validateRequest } from '../../middlewares/validateRequest.js';
import { quotesAdminController } from '../../controllers/admin/quotes.controller.js';
import {
  quoteIdParamSchema,
  quoteNotificationsQuerySchema,
  quoteSendProposalSchema,
  quoteUpdateSchema
} from '../../validators/quotes.validator.js';

export const quotesAdminRouter = Router();

quotesAdminRouter.get('/notifications', validateRequest({ query: quoteNotificationsQuerySchema }), quotesAdminController.notifications);
quotesAdminRouter.get('/', quotesAdminController.list);
quotesAdminRouter.get('/:id', validateRequest({ params: quoteIdParamSchema }), quotesAdminController.getById);
quotesAdminRouter.patch('/:id', validateRequest({ params: quoteIdParamSchema, body: quoteUpdateSchema }), quotesAdminController.update);
quotesAdminRouter.delete('/:id', validateRequest({ params: quoteIdParamSchema }), quotesAdminController.remove);
quotesAdminRouter.post(
  '/:id/send-proposal',
  validateRequest({ params: quoteIdParamSchema, body: quoteSendProposalSchema }),
  quotesAdminController.sendProposal
);
