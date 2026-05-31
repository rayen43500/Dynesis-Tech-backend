import { ApiError } from '../../../shared/http/apiErrors.js';

export function requireRoles(allowedRoles = []) {
  const rolesSet = new Set(allowedRoles);

  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError({ statusCode: 401, code: 'AUTH_NOT_AUTHENTICATED', message: 'Not authenticated' });
    }

    if (rolesSet.size > 0 && !rolesSet.has(req.user.role)) {
      throw new ApiError({ statusCode: 403, code: 'AUTH_FORBIDDEN', message: 'Forbidden' });
    }

    next();
  };
}

export function requirePermissions(requiredPermissions = []) {
  const required = new Set(requiredPermissions);

  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError({ statusCode: 401, code: 'AUTH_NOT_AUTHENTICATED', message: 'Not authenticated' });
    }

    if (required.size > 0) {
      const perms = new Set(req.user.permissions || []);
      for (const p of required) {
        if (!perms.has(p)) {
          throw new ApiError({ statusCode: 403, code: 'AUTH_FORBIDDEN', message: 'Forbidden' });
        }
      }
    }

    next();
  };
}

