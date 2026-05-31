import crypto from 'crypto';
import {
  signAccessToken as _signAccessToken,
  signRefreshToken as _signRefreshToken,
  verifyAccessToken as _verifyAccessToken,
  verifyRefreshToken as _verifyRefreshToken
} from '../../config/auth.js';

export function createAccessToken({ userId, role, permissions = [] }) {
  return _signAccessToken({ sub: userId, role, permissions });
}

export function createRefreshToken({ userId }) {
  // jti allows rotation + revocation
  const jti = crypto.randomBytes(16).toString('hex');
  const token = _signRefreshToken({ sub: userId, jti, tokenType: 'refresh' });
  return { token, jti };
}

export function verifyAccessToken(token) {
  const payload = _verifyAccessToken(token);
  if (!payload?.sub || payload?.tokenType === 'refresh') {
    throw new Error('Invalid access token');
  }
  return payload;
}

export function verifyRefreshToken(token) {
  const payload = _verifyRefreshToken(token);
  if (payload?.tokenType !== 'refresh' || !payload?.sub || !payload?.jti) {
    throw new Error('Invalid refresh token');
  }
  return payload;
}

