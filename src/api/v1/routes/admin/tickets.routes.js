import { Router } from 'express';

import { ticketsAdminController } from '../../controllers/tickets.controller.js';

export const ticketsAdminRouter = Router();

ticketsAdminRouter.get('/', ticketsAdminController.list);
ticketsAdminRouter.get('/:id', ticketsAdminController.getById);
ticketsAdminRouter.patch('/:id', ticketsAdminController.update);
ticketsAdminRouter.post('/:id/reply', ticketsAdminController.reply);
