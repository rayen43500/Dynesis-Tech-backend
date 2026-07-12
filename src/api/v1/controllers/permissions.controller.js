import { Permission } from '../../../modules/permissions/models/Permission.model.js';
import { Role } from '../../../modules/permissions/models/Role.model.js';
import { User } from '../../../modules/users/models/User.model.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../shared/http/apiResponse.js';
import { ApiError } from '../../../shared/http/apiErrors.js';

export const permissionsController = {
  listPermissions: asyncHandler(async (_req, res) => {
    const items = await Permission.find().sort({ group: 1, key: 1 }).lean();
    return sendSuccess(res, { data: items });
  }),

  listRoles: asyncHandler(async (_req, res) => {
    const items = await Role.find().sort({ key: 1 }).lean();
    return sendSuccess(res, { data: items });
  }),

  updateRole: asyncHandler(async (req, res) => {
    const updated = await Role.findOneAndUpdate({ key: req.params.key }, { $set: { permissions: req.body.permissions || [] } }, { new: true }).lean();
    if (!updated) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Role not found' });
    return sendSuccess(res, { data: updated });
  }),

  updateUserPermissions: asyncHandler(async (req, res) => {
    const updated = await User.findByIdAndUpdate(req.params.userId, { $set: { permissions: req.body.permissions || [] } }, { new: true })
      .select('-passwordHash -twoFactorSecret')
      .lean();
    if (!updated) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'User not found' });
    return sendSuccess(res, { data: updated });
  })
};
