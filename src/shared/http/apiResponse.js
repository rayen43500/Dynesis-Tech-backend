export function sendSuccess(res, { data = null, meta = undefined, statusCode = 200 } = {}) {
  return res.status(statusCode).json({
    data,
    meta
  });
}

