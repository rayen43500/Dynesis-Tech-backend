import { Router } from 'express';

import { clientMessagesController } from '../../controllers/client/messages.controller.js';

export const clientMessagesRouter = Router();

clientMessagesRouter.get('/', clientMessagesController.list);
