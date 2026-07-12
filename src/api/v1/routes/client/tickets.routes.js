import { Router } from 'express';

import { ticketsClientController } from '../../controllers/tickets.controller.js';

export const clientTicketsRouter = Router();

clientTicketsRouter.get('/', ticketsClientController.list);
clientTicketsRouter.post('/', ticketsClientController.create);
clientTicketsRouter.get('/:id', ticketsClientController.getById);
clientTicketsRouter.post('/:id/reply', ticketsClientController.reply);
