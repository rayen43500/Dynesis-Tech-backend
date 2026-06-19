import { verifyAccessToken } from '../../../shared/security/tokens.js';

/** Sets req.user when a valid Bearer token is present; never rejects. */
export function optionalAuthJwt(req, _res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type === 'Bearer' && token) {
    try {
      const payload = verifyAccessToken(token);
      req.user = {
        userId: payload.sub,
        role: payload.role,
        permissions: payload.permissions || []
      };
    } catch {
      // Ignore invalid tokens on public endpoints.
    }
  }

  return next();
}
