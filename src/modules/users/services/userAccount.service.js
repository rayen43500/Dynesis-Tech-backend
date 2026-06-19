import { hashPassword, verifyPassword } from '../../../shared/security/password.js';
import { ApiError } from '../../../shared/http/apiErrors.js';
import { deleteUploadFile, toPublicUserUploadPath } from '../../../config/upload.js';
import { User } from '../models/User.model.js';

export function mapPublicUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    displayName: user.displayName || '',
    profilePicture: user.profilePicture || ''
  };
}

export const userAccountService = {
  async updateAccount({ userId, displayName, email, photoFilename }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'User not found' });
    }

    if (email && email !== user.email) {
      const duplicate = await User.findOne({ email, _id: { $ne: userId } });
      if (duplicate) {
        throw new ApiError({ statusCode: 409, code: 'AUTH_EMAIL_ALREADY_REGISTERED', message: 'Email already registered' });
      }
      user.email = email;
    }

    if (typeof displayName === 'string') {
      user.displayName = displayName.trim();
    }

    if (photoFilename) {
      deleteUploadFile(user.profilePicture);
      user.profilePicture = toPublicUserUploadPath(photoFilename);
    }

    await user.save();
    return mapPublicUser(user);
  },

  async changePassword({ userId, currentPassword, newPassword }) {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) {
      throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'User not found' });
    }

    if (!user.passwordHash) {
      throw new ApiError({
        statusCode: 400,
        code: 'AUTH_NO_PASSWORD',
        message: 'No password is set for this account.'
      });
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      throw new ApiError({
        statusCode: 401,
        code: 'AUTH_INVALID_CURRENT_PASSWORD',
        message: 'Current password is incorrect.'
      });
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();
    return { ok: true };
  }
};
