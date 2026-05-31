import { OAuth2Client } from 'google-auth-library';

import { env } from '../../../config/env.js';
import { ApiError } from '../../../shared/http/apiErrors.js';

import { User } from '../../users/models/User.model.js';
import { authService } from './auth.service.js';

export function getGoogleOAuthClient() {
  if (!env.GOOGLE_CLIENT_ID) return null;
  return new OAuth2Client(env.GOOGLE_CLIENT_ID);
}

export const googleAuthService = {
  async verifyIdTokenAndIssueTokens({ idToken }) {
    const client = getGoogleOAuthClient();
    if (!client) {
      throw new ApiError({ statusCode: 500, code: 'GOOGLE_NOT_CONFIGURED', message: 'Google auth is not configured' });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new ApiError({ statusCode: 401, code: 'GOOGLE_INVALID_TOKEN', message: 'Invalid Google token' });
    }

    const email = payload.email;
    const displayName = payload.name || '';

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        displayName,
        role: 'client',
        passwordHash: undefined
      });
    }

    // Ensure we have role and issue tokens. Google user is treated as client by default.
    return authService.issueTokensForUserDoc(user);
  }
};

