import jwt from 'jsonwebtoken';
import { env } from './env.js';

export const AUTH = {
  jwt: {
    secret: env.JWT_SECRET,
    // Production defaults; you can later externalize these into env.
    accessTtlSeconds: 60 * 15, // 15 minutes
    refreshTtlSeconds: 60 * 60 * 24 * 30 // 30 days
  },
  cookie: {
    name: 'refresh_token',
    httpOnly: true,
    // Cross-origin frontend (e.g. Netlify → Render) requires SameSite=None in production.
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
};

export function signAccessToken(payload) {
  return jwt.sign(payload, AUTH.jwt.secret, { expiresIn: AUTH.jwt.accessTtlSeconds });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, AUTH.jwt.secret, { expiresIn: AUTH.jwt.refreshTtlSeconds });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, AUTH.jwt.secret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, AUTH.jwt.secret);
}

