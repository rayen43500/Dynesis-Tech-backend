import { ApiError } from '../../../shared/http/apiErrors.js';
import mongoose from 'mongoose';

export function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-unused-vars
  const requestId = req.requestId;

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        requestId
      }
    });
  }

  // Handle common Mongoose errors
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Database validation failed',
        details: [{ message: err.message }],
        requestId
      }
    });
  }

  // JWT / JSON parsing errors (fallback)
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'production' ? undefined : { name: err?.name, message: err?.message },
      requestId
    }
  });
}

