import { Router } from "express";
import * as paymentController from "../controllers/payment.controller.js";
import { validateBody } from "../middleware/validate.js";
import { checkoutPlanSchema } from "../validators/schemas.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post(
  "/checkout-session",
  requireAuth,
  validateBody(checkoutPlanSchema),
  paymentController.checkoutSession
);
router.get("/history", requireAuth, paymentController.history);

export default router;
