import { ApiError } from '../../../shared/http/apiErrors.js';
import { toZodErrorDetails } from '../../../shared/http/apiErrors.js';

export function validateRequest({ body, params, query } = {}) {
  return (req, res, next) => {
    try {
      if (body) req.body = body.parse(req.body);
      if (params) req.params = params.parse(req.params);
      if (query) req.query = query.parse(req.query);
      return next();
    } catch (err) {
      const details = toZodErrorDetails(err);
      throw new ApiError({
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details
      });
    }
  };
}

