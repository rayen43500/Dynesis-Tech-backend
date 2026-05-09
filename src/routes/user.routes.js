import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { validateBody } from "../middleware/validate.js";
import { passwordUpdateSchema, profileUpdateSchema } from "../validators/schemas.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", requireAuth, userController.dashboard);
router.patch("/profile", requireAuth, validateBody(profileUpdateSchema), userController.updateProfile);
router.patch("/password", requireAuth, validateBody(passwordUpdateSchema), userController.updatePassword);

export default router;
