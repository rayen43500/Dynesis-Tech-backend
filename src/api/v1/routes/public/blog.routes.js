import { Router } from 'express';

import { blogPublicController } from '../../controllers/blog.controller.js';

export const blogPublicRouter = Router();

blogPublicRouter.get('/', blogPublicController.list);
blogPublicRouter.get('/:slug', blogPublicController.getBySlug);
