import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validateBody } from "../middleware/validate.js";
import { validateQuery } from "../middleware/validateQuery.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendVerificationSchema,
  verifyEmailQuerySchema
} from "../validators/schemas.js";
import { requireAuth } from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimiters.js";

const router = Router();

router.get("/verify-email", validateQuery(verifyEmailQuerySchema), authController.verifyEmail);
router.post("/register", loginLimiter, validateBody(registerSchema), authController.register);
router.post("/login", loginLimiter, validateBody(loginSchema), authController.login);
router.get("/me", requireAuth, authController.me);
router.post(
  "/resend-verification",
  loginLimiter,
  validateBody(resendVerificationSchema),
  authController.resendVerification
);
router.post("/forgot-password", loginLimiter, validateBody(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", loginLimiter, validateBody(resetPasswordSchema), authController.resetPassword);

export default router;
