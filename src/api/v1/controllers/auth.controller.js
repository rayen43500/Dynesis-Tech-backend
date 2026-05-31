import { env } from '../../../config/env.js';
import { AUTH } from '../../../config/auth.js';

import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authService } from '../../../modules/auth/services/auth.service.js';
import { googleAuthService } from '../../../modules/auth/services/googleAuth.service.js';
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

export const authController = {
  register: asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    await authService.registerClient({ name, email, password });
    return res.status(201).json({ success: true, message: 'Check your email to activate your account.' });
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, tokens } = await authService.loginWithPassword({ email, password });

    res.cookie(AUTH.cookie.name, tokens.refreshToken, cookieOptions());
    return res.status(200).json({ data: { user, accessToken: tokens.accessToken } });
  }),

  me: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const result = await authService.me({ userId });
    return res.status(200).json({ data: result.user });
  }),

  refresh: asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.[AUTH.cookie.name] || req.body?.refreshToken;
    if (!refreshToken) {
      throw new ApiError({ statusCode: 401, code: 'AUTH_MISSING_REFRESH', message: 'Missing refresh token' });
    }

    const { tokens } = await authService.refresh({ refreshToken });
    res.cookie(AUTH.cookie.name, tokens.refreshToken, cookieOptions());
    return res.status(200).json({ data: { accessToken: tokens.accessToken } });
  }),

  logout: asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.[AUTH.cookie.name] || req.body?.refreshToken;
    if (refreshToken) {
      await authService.logout({ refreshToken });
    }

    res.clearCookie(AUTH.cookie.name, { path: '/api/v1/auth/refresh' });
    return res.status(200).json({ data: { ok: true } });
  }),

  googleVerify: asyncHandler(async (req, res) => {
    const { idToken } = req.body;
    const tokens = await googleAuthService.verifyIdTokenAndIssueTokens({ idToken });

    res.cookie(AUTH.cookie.name, tokens.refreshToken, cookieOptions());
    return res.status(200).json({ data: { accessToken: tokens.accessToken } });
  }),

  activate: asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { user, tokens } = await authService.activateAccount({ token });

    res.cookie(AUTH.cookie.name, tokens.refreshToken, cookieOptions());
    return res.status(200).json({ data: { user, accessToken: tokens.accessToken } });
  }),

  resendActivation: asyncHandler(async (req, res) => {
    const { email } = req.body;
    await authService.resendActivation({ email });
    return res.status(200).json({ success: true });
  })
};

