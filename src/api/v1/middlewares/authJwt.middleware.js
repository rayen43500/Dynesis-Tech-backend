import { ApiError } from '../../../shared/http/apiErrors.js';
import { verifyAccessToken } from '../../../shared/security/tokens.js';

export function authJwt(req, res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    throw new ApiError({ statusCode: 401, code: 'AUTH_MISSING_TOKEN', message: 'Missing access token' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      userId: payload.sub,
      role: payload.role,
      permissions: payload.permissions || []
    };
    return next();
  } catch (err) {
    throw new ApiError({ statusCode: 401, code: 'AUTH_INVALID_TOKEN', message: 'Invalid access token' });
  }
}

