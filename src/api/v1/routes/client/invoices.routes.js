import { Router } from 'express';

import { invoicesClientController } from '../../controllers/client/invoices.controller.js';

export const clientInvoicesRouter = Router();

clientInvoicesRouter.get('/', invoicesClientController.list);
clientInvoicesRouter.get('/:id', invoicesClientController.getById);
clientInvoicesRouter.post('/:id/pay', invoicesClientController.pay);
