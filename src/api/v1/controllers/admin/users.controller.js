import { User } from '../../../../modules/users/models/User.model.js';
import { invitationService } from '../../../../modules/invitations/services/invitation.service.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { parsePagination } from '../../../../shared/http/pagination.js';

export const usersAdminController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};

    if (req.query.role) {
      filter.role = req.query.role;
    }

    if (req.query.search) {
      const q = req.query.search.trim();
      filter.$or = [
        { email: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } }
      ];
    }

    const [items, total] = await Promise.all([
      User.find(filter)
        .select('-passwordHash -twoFactorSecret')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter)
    ]);

    return sendSuccess(res, { data: items, meta: { page, limit, total } });
  }),

  getById: asyncHandler(async (req, res) => {
    const doc = await User.findById(req.params.id)
      .select('-passwordHash -twoFactorSecret')
      .lean();
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'User not found' });
    return sendSuccess(res, { data: doc });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { displayName, role, permissions, isActivated } = req.body;

    const user = await User.findById(id);
    if (!user) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'User not found' });

    if (displayName !== undefined) user.displayName = displayName.trim();
    if (role !== undefined) user.role = role;
    if (permissions !== undefined) user.permissions = permissions;
    if (isActivated !== undefined) user.isActivated = isActivated;

    await user.save();

    const updated = await User.findById(id)
      .select('-passwordHash -twoFactorSecret')
      .lean();

    return sendSuccess(res, { data: updated });
  }),

  remove: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (id === req.user.userId) {
      throw new ApiError({ statusCode: 400, code: 'BAD_REQUEST', message: 'You cannot delete yourself' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'User not found' });

    return sendSuccess(res, { data: { id, deleted: true } });
  }),

  invite: asyncHandler(async (req, res) => {
    const { email, role } = req.body;
    const result = await invitationService.createInvitation({
      createdBy: req.user.userId,
      email,
      role
    });
    return sendSuccess(res, { data: result });
  })
};
