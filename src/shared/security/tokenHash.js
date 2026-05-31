import crypto from 'crypto';

export function sha256Hex(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

