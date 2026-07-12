import { Router } from 'express';

import { authJwt } from '../middlewares/authJwt.middleware.js';
import { messagingController } from '../controllers/messaging.controller.js';

export const messagingRouter = Router();

messagingRouter.use(authJwt);

messagingRouter.get('/rooms', messagingController.listRooms);
messagingRouter.get('/rooms/:roomId/messages', messagingController.listMessages);
messagingRouter.post('/rooms/:roomId/messages', messagingController.sendMessage);
