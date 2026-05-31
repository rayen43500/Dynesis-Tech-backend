import crypto from 'crypto';

export function requestId(req, res, next) {
  const id = req.headers['x-request-id'] || crypto.randomUUID();
  req.requestId = id;
  res.setHeader('x-request-id', id);
  next();
}

