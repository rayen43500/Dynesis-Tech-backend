import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { userAccountService } from '../../../../modules/users/services/userAccount.service.js';

export const adminAccountController = {
  update: asyncHandler(async (req, res) => {
    const { displayName } = req.body;
    const user = await userAccountService.updateAccount({
      userId: req.user.userId,
      displayName,
      photoFilename: req.file?.filename
    });

    return sendSuccess(res, { data: user });
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await userAccountService.changePassword({
      userId: req.user.userId,
      currentPassword,
      newPassword
    });

    return sendSuccess(res, { data: { ok: true } });
  })
};
