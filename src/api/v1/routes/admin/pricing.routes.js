import { Router } from 'express';

import { pricingAdminController } from '../../controllers/admin/pricing.controller.js';

export const pricingAdminRouter = Router();

pricingAdminRouter.get('/', pricingAdminController.list);
pricingAdminRouter.post('/', pricingAdminController.create);
pricingAdminRouter.get('/:id', pricingAdminController.getById);
pricingAdminRouter.patch('/:id', pricingAdminController.update);
pricingAdminRouter.delete('/:id', pricingAdminController.remove);
