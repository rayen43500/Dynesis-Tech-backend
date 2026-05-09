import * as authService from "../services/auth.service.js";

export async function register(req, res, next) {
  try {
    const result = await authService.registerUser(req.body);
    return res.status(201).json(result);
  } catch (e) {
    if (e.statusCode === 409) {
      return res.status(409).json({ message: e.message });
    }
    return next(e);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.body);
    return res.json(result);
  } catch (e) {
    if (e.statusCode === 401) {
      return res.status(401).json({ message: e.message });
    }
    if (e.message === "JWT_SECRET manquant.") {
      // eslint-disable-next-line no-console
      console.error(e);
      return res.status(500).json({ message: "Configuration serveur incorrecte." });
    }
    return next(e);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getMe(req.user.sub);
    return res.json(user);
  } catch (e) {
    return next(e);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const result = await authService.verifyEmailWithToken(req.query.token);
    return res.json(result);
  } catch (e) {
    if (e.statusCode === 400) {
      return res.status(400).json({ message: e.message });
    }
    return next(e);
  }
}

export async function resendVerification(req, res, next) {
  try {
    const result = await authService.resendVerificationEmail(req.body.email);
    return res.json(result);
  } catch (e) {
    return next(e);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const result = await authService.requestPasswordReset(req.body.email);
    return res.json(result);
  } catch (e) {
    return next(e);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const result = await authService.resetPasswordWithToken(req.body.token, req.body.newPassword);
    return res.json(result);
  } catch (e) {
    if (e.statusCode === 400) {
      return res.status(400).json({ message: e.message });
    }
    return next(e);
  }
}
