import { Router } from "express";
import * as subscriptionController from "../controllers/subscription.controller.js";
import { validateBody } from "../middleware/validate.js";
import { selectPlanSchema } from "../validators/schemas.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/mine", requireAuth, subscriptionController.mine);
router.post("/select-plan", requireAuth, validateBody(selectPlanSchema), subscriptionController.selectPlan);

export default router;
