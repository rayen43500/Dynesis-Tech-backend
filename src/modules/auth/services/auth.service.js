import crypto from 'crypto';

import { ApiError } from '../../../shared/http/apiErrors.js';
import { hashPassword, verifyPassword } from '../../../shared/security/password.js';
import { sha256Hex } from '../../../shared/security/tokenHash.js';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../../../shared/security/tokens.js';
import { AUTH } from '../../../config/auth.js';
import { env } from '../../../config/env.js';

import { User } from '../../users/models/User.model.js';
import { Quote } from '../../quotes/models/Quote.model.js';
import { RefreshToken } from '../models/RefreshToken.model.js';
import { sendEmail } from '../../../infrastructure/mail/mailer.js';
import { activationEmailTemplate } from '../../../infrastructure/mail/emailTemplates.js';
import { mapPublicUser } from '../../users/services/userAccount.service.js';

function calcRefreshExpiresAt() {
  return new Date(Date.now() + AUTH.jwt.refreshTtlSeconds * 1000);
}

async function storeRefreshToken({ userId, token, jti }) {
  const tokenHash = sha256Hex(token);

  await RefreshToken.create({
    userId,
    tokenHash,
    jti,
    expiresAt: calcRefreshExpiresAt(),
    revokedAt: null
  });
}

async function revokeRefreshToken({ tokenHash }) {
  await RefreshToken.updateOne({ tokenHash, revokedAt: null }, { $set: { revokedAt: new Date() } });
}

async function issueTokensForUser(user) {
  const accessToken = createAccessToken({ userId: user._id.toString(), role: user.role });

  const { token: refreshToken, jti } = createRefreshToken({ userId: user._id.toString() });
  await storeRefreshToken({ userId: user._id, token: refreshToken, jti });

  return { accessToken, refreshToken };
}

function generateActivationToken() {
  return crypto.randomBytes(32).toString('hex');
}

function getDefaultFrontendUrl() {
  return env.FRONTEND_URL.split(',')[0]?.trim();
}

async function sendActivationEmail({ email, token }) {
  const frontendUrl = getDefaultFrontendUrl();
  const link = `${frontendUrl}/activate/${token}`;
  const { subject, text, html } = activationEmailTemplate({ activationLink: link });
  await sendEmail({ to: email, subject, text, html });
}

export const authService = {
  async registerClient({ name, email, password }) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError({ statusCode: 409, code: 'AUTH_EMAIL_ALREADY_REGISTERED', message: 'Email already registered' });
    }

    const passwordHash = await hashPassword(password);
    const activationToken = generateActivationToken();
    const activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await User.create({
      email,
      passwordHash,
      role: 'client',
      displayName: name,
      isActivated: false,
      activationToken,
      activationTokenExpires
    });

    await sendActivationEmail({ email, token: activationToken });
    return { ok: true };
  },

  async loginWithPassword({ email, password }) {
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) throw new ApiError({ statusCode: 401, code: 'AUTH_INVALID_CREDENTIALS', message: 'Invalid credentials' });

    if (!user.passwordHash) {
      // Prevent bcrypt from throwing when passwordHash is missing.
      throw new ApiError({ statusCode: 401, code: 'AUTH_INVALID_CREDENTIALS', message: 'Invalid credentials' });
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) throw new ApiError({ statusCode: 401, code: 'AUTH_INVALID_CREDENTIALS', message: 'Invalid credentials' });
    if (user.role === 'client' && !user.isActivated) {
      throw new ApiError({
        statusCode: 403,
        code: 'AUTH_NOT_ACTIVATED',
        message: 'Please activate your account first. Check your email.'
      });
    }

    const existingQuote = await Quote.findOne({ email: user.email, userId: null });
    if (existingQuote) {
      existingQuote.userId = user._id;
      await existingQuote.save();
    }

    return { user: mapPublicUser(user), tokens: await issueTokensForUser(user) };
  },

  async me({ userId }) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'User not found' });
    return { user: mapPublicUser(user) };
  },

  async refresh({ refreshToken }) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError({ statusCode: 401, code: 'AUTH_INVALID_REFRESH_TOKEN', message: 'Invalid refresh token' });
    }

    const userId = payload.sub;
    const jti = payload.jti;
    const tokenHash = sha256Hex(refreshToken);

    const stored = await RefreshToken.findOne({ userId, tokenHash, jti, revokedAt: null });
    if (!stored) {
      throw new ApiError({
        statusCode: 401,
        code: 'AUTH_REFRESH_TOKEN_REVOKED',
        message: 'Refresh token revoked or invalid'
      });
    }

    if (stored.expiresAt && stored.expiresAt.getTime() < Date.now()) {
      throw new ApiError({ statusCode: 401, code: 'AUTH_REFRESH_TOKEN_EXPIRED', message: 'Refresh token expired' });
    }

    // Rotation: revoke current refresh token and issue new pair.
    await revokeRefreshToken({ tokenHash });

    const user = await User.findById(userId);
    if (!user) throw new ApiError({ statusCode: 401, code: 'AUTH_INVALID_USER', message: 'Invalid user' });

    const tokens = await issueTokensForUser(user);
    return { tokens };
  },

  async logout({ refreshToken }) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const tokenHash = sha256Hex(refreshToken);
      await revokeRefreshToken({ tokenHash });
      return { ok: true };
    } catch {
      // Idempotent logout: don't leak token errors
      return { ok: true };
    }
  },

  async issueTokensForUserDoc(user) {
    return issueTokensForUser(user);
  },

  async activateAccount({ token }) {
    const user = await User.findOne({ activationToken: token });
    if (!user) {
      throw new ApiError({ statusCode: 400, code: 'AUTH_INVALID_ACTIVATION_LINK', message: 'Invalid link.' });
    }

    if (!user.activationTokenExpires || user.activationTokenExpires.getTime() < Date.now()) {
      throw new ApiError({ statusCode: 400, code: 'AUTH_ACTIVATION_LINK_EXPIRED', message: 'Link expired.' });
    }

    user.isActivated = true;
    user.activationToken = undefined;
    user.activationTokenExpires = undefined;
    await user.save();

    const existingQuote = await Quote.findOne({ email: user.email, userId: null });
    if (existingQuote) {
      existingQuote.userId = user._id;
      await existingQuote.save();
    }

    const tokens = await issueTokensForUser(user);
    return {
      user: mapPublicUser(user),
      tokens
    };
  },

  async resendActivation({ email }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError({ statusCode: 404, code: 'AUTH_USER_NOT_FOUND', message: 'User not found' });
    }
    if (user.isActivated) {
      throw new ApiError({ statusCode: 400, code: 'AUTH_ALREADY_ACTIVATED', message: 'Account already activated' });
    }

    const activationToken = generateActivationToken();
    const activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.activationToken = activationToken;
    user.activationTokenExpires = activationTokenExpires;
    await user.save();

    await sendActivationEmail({ email: user.email, token: activationToken });
    return { ok: true };
  },

  // For future onboarding flows (invitations / invitations accept)
  async setPasswordForUser({ userId, password }) {
    const passwordHash = await hashPassword(password);
    await User.updateOne({ _id: userId }, { $set: { passwordHash } });
    return { ok: true };
  }
};

