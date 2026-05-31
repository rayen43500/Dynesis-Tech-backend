import { Router } from 'express';

import { authJwt } from '../middlewares/authJwt.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';

import { paymentsController } from '../controllers/payments.controller.js';
import { createCheckoutSessionSchema } from '../validators/payments.validator.js';

export const paymentsRouter = Router();

paymentsRouter.post(
  '/checkout',
  authJwt,
  requireRoles(['admin', 'client']),
  validateRequest({ body: createCheckoutSessionSchema }),
  paymentsController.createCheckoutSession
);

paymentsRouter.post('/webhook', paymentsController.stripeWebhook);

