import crypto from 'crypto';

import { User } from '../../users/models/User.model.js';
import { ApiError } from '../../../shared/http/apiErrors.js';

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buffer) {
  let bits = 0;
  let value = 0;
  let output = '';
  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += BASE32[(value << (5 - bits)) & 31];
  return output;
}

function generateSecret() {
  return base32Encode(crypto.randomBytes(20)).replace(/=+$/, '');
}

function verifyTotp(secret, token) {
  const step = 30;
  const now = Math.floor(Date.now() / 1000);
  for (const offset of [-1, 0, 1]) {
    const counter = Math.floor(now / step) + offset;
    const expected = hotp(secret, counter);
    if (expected === String(token).padStart(6, '0')) return true;
  }
  return false;
}

function hotp(secret, counter) {
  const key = base32Decode(secret);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = crypto.createHmac('sha1', key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = ((hmac[offset] & 0x7f) << 24) | (hmac[offset + 1] << 16) | (hmac[offset + 2] << 8) | hmac[offset + 3];
  return String(code % 1_000_000).padStart(6, '0');
}

function base32Decode(input) {
  let bits = 0;
  let value = 0;
  const output = [];
  const normalized = input.toUpperCase().replace(/=+$/, '');
  for (const char of normalized) {
    const idx = BASE32.indexOf(char);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(output);
}

function otpauthUrl({ secret, email }) {
  const label = encodeURIComponent(`Dynesis Tech:${email}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=Dynesis%20Tech&digits=6&period=30`;
}

export const twoFactorService = {
  async setup({ userId }) {
    const user = await User.findById(userId).select('+twoFactorSecret');
    if (!user) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'User not found' });

    const secret = generateSecret();
    user.twoFactorSecret = secret;
    user.twoFactorEnabled = false;
    await user.save();

    return {
      secret,
      otpauthUrl: otpauthUrl({ secret, email: user.email })
    };
  },

  async enable({ userId, token }) {
    const user = await User.findById(userId).select('+twoFactorSecret');
    if (!user?.twoFactorSecret) {
      throw new ApiError({ statusCode: 400, code: '2FA_NOT_SETUP', message: '2FA not setup' });
    }
    if (!verifyTotp(user.twoFactorSecret, token)) {
      throw new ApiError({ statusCode: 400, code: '2FA_INVALID_TOKEN', message: 'Invalid token' });
    }
    user.twoFactorEnabled = true;
    await user.save();
    return { enabled: true };
  },

  async disable({ userId, token }) {
    const user = await User.findById(userId).select('+twoFactorSecret');
    if (!user?.twoFactorEnabled) return { enabled: false };
    if (!verifyTotp(user.twoFactorSecret, token)) {
      throw new ApiError({ statusCode: 400, code: '2FA_INVALID_TOKEN', message: 'Invalid token' });
    }
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();
    return { enabled: false };
  },

  verifyToken(user, token) {
    if (!user?.twoFactorEnabled || !user.twoFactorSecret) return true;
    return verifyTotp(user.twoFactorSecret, token);
  }
};
