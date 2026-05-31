import { env } from '../../../config/env.js';
import { AUTH } from '../../../config/auth.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

import { invitationService } from '../../../modules/invitations/services/invitation.service.js';
import { ApiError } from '../../../shared/http/apiErrors.js';

function cookieOptions() {
  return {
    httpOnly: AUTH.cookie.httpOnly,
    sameSite: AUTH.cookie.sameSite,
    secure: env.NODE_ENV === 'production',
    path: '/api/v1/auth/refresh',
    maxAge: AUTH.jwt.refreshTtlSeconds * 1000
  };
}

export const invitationsController = {
  createInvitation: asyncHandler(async (req, res) => {
    if (!req.user?.userId) {
      throw new ApiError({ statusCode: 401, code: 'AUTH_NOT_AUTHENTICATED', message: 'Not authenticated' });
    }

    const { email, role } = req.body;
    const { invitationId } = await invitationService.createInvitation({
      createdBy: req.user.userId,
      email,
      role
    });

    return res.status(201).json({ data: { invitationId } });
  }),

  acceptInvitation: asyncHandler(async (req, res) => {
    const { token, email, password, displayName } = req.body;

    const result = await invitationService.acceptInvitation({ token, email, password, displayName });
    // invitationService.acceptInvitation returns { user, tokens } from authService.loginWithPassword
    const tokens = result.tokens;

    res.cookie(AUTH.cookie.name, tokens.refreshToken, cookieOptions());
    return res.status(200).json({ data: { user: result.user, accessToken: tokens.accessToken } });
  })
};

