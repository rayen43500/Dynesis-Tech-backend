import { Router } from 'express';

import { authJwt } from '../middlewares/authJwt.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';

import { invitationsController } from '../controllers/invitations.controller.js';
import { createInvitationSchema, acceptInvitationSchema } from '../validators/invitations.validator.js';

export const invitationsRouter = Router();

// Admin creates invitation tokens for onboarding.
invitationsRouter.post(
  '/create',
  authJwt,
  requireRoles(['admin']),
  validateRequest({ body: createInvitationSchema }),
  invitationsController.createInvitation
);

// Client accepts invitation token and sets password.
invitationsRouter.post('/accept', validateRequest({ body: acceptInvitationSchema }), invitationsController.acceptInvitation);

