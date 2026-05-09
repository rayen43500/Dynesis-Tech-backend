import * as userService from "../services/user.service.js";

export async function dashboard(req, res, next) {
  try {
    const data = await userService.getDashboard(req.user.sub, req.user.email);
    return res.json(data);
  } catch (e) {
    return next(e);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const user = await userService.updateProfile(req.user.sub, req.body);
    return res.json(user);
  } catch (e) {
    return next(e);
  }
}

export async function updatePassword(req, res, next) {
  try {
    const result = await userService.updatePassword(
      req.user.sub,
      req.body.currentPassword,
      req.body.newPassword
    );
    return res.json(result);
  } catch (e) {
    if (e.statusCode === 404) {
      return res.status(404).json({ message: e.message });
    }
    if (e.statusCode === 400) {
      return res.status(400).json({ message: e.message });
    }
    return next(e);
  }
}
