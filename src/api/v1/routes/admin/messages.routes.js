import { Router } from 'express';

import { validateRequest } from '../../middlewares/validateRequest.js';
import { messagesAdminController } from '../../controllers/admin/messages.controller.js';
import { messageIdParamSchema, messageReplySchema, messageUpdateSchema } from '../../validators/messages.validator.js';

export const messagesAdminRouter = Router();

messagesAdminRouter.get('/', messagesAdminController.list);
messagesAdminRouter.get('/:id', validateRequest({ params: messageIdParamSchema }), messagesAdminController.getById);
messagesAdminRouter.patch('/:id', validateRequest({ params: messageIdParamSchema, body: messageUpdateSchema }), messagesAdminController.update);
messagesAdminRouter.delete('/:id', validateRequest({ params: messageIdParamSchema }), messagesAdminController.remove);
messagesAdminRouter.post('/:id/reply', validateRequest({ params: messageIdParamSchema, body: messageReplySchema }), messagesAdminController.reply);
