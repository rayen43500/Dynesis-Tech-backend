import { Router } from 'express';

import { validateRequest } from '../../middlewares/validateRequest.js';
import { portfoliosAdminController } from '../../controllers/admin/portfolios.controller.js';
import { portfolioCreateSchema, portfolioUpdateSchema, portfoliosIdParamSchema } from '../../validators/admin/portfolios.validator.js';

export const portfoliosAdminRouter = Router();

portfoliosAdminRouter.get('/', portfoliosAdminController.list);
portfoliosAdminRouter.post('/', validateRequest({ body: portfolioCreateSchema }), portfoliosAdminController.create);
portfoliosAdminRouter.get('/:id', validateRequest({ params: portfoliosIdParamSchema }), portfoliosAdminController.getById);
portfoliosAdminRouter.patch('/:id', validateRequest({ params: portfoliosIdParamSchema, body: portfolioUpdateSchema }), portfoliosAdminController.update);

