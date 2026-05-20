import { Router } from "express";
import * as quoteController from "../controllers/quote.controller.js";
import { validateBody } from "../middleware/validate.js";
import { quoteCreateSchema } from "../validators/schemas.js";
import { optionalAuth, requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", optionalAuth, validateBody(quoteCreateSchema), quoteController.create);
router.get("/", requireAuth, requireAdmin, quoteController.list);

export default router;
