import { Router } from 'express';

import { validateRequest } from '../middlewares/validateRequest.js';
import { authJwt } from '../middlewares/authJwt.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';

import { authController } from '../controllers/auth.controller.js';
import { loginSchema, registerSchema, refreshSchema, googleVerifySchema, resendActivationSchema } from '../validators/auth.validator.js';

export const authRouter = Router();

authRouter.post('/register', validateRequest({ body: registerSchema }), authController.register);
authRouter.post('/login', validateRequest({ body: loginSchema }), authController.login);
authRouter.get('/activate/:token', authController.activate);
authRouter.post('/resend-activation', validateRequest({ body: resendActivationSchema }), authController.resendActivation);

authRouter.get('/me', authJwt, authController.me);

authRouter.post('/refresh', validateRequest({ body: refreshSchema }), authController.refresh);
authRouter.post('/logout', validateRequest({ body: refreshSchema }), authController.logout);

authRouter.post('/google/verify', validateRequest({ body: googleVerifySchema }), authController.googleVerify);

// Invitation-based onboarding:
// - Admin creates invitations under `/api/v1/invitations`
// - Clients accept invitations under `/api/v1/invitations/accept`

