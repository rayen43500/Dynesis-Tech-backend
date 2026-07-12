import { Router } from 'express';

import { blogAdminController } from '../../controllers/blog.controller.js';

export const blogAdminRouter = Router();

blogAdminRouter.get('/', blogAdminController.list);
blogAdminRouter.post('/', blogAdminController.create);
blogAdminRouter.patch('/:id', blogAdminController.update);
blogAdminRouter.delete('/:id', blogAdminController.remove);
