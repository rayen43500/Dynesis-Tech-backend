import { Router } from "express";
import * as contentController from "../controllers/content.controller.js";
import { validateBody } from "../middleware/validate.js";
import {
  faqCreateSchema,
  moderateReviewSchema,
  newsletterSubscribeSchema,
  portfolioProjectSchema,
  reviewCreateSchema
} from "../validators/schemas.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validateMongoIdParam } from "../middleware/validateParams.js";

const router = Router();

router.get("/portfolio", contentController.getPortfolio);
router.post(
  "/portfolio",
  requireAuth,
  requireAdmin,
  validateBody(portfolioProjectSchema),
  contentController.postPortfolio
);

router.get("/reviews", contentController.getReviews);
router.post("/reviews", validateBody(reviewCreateSchema), contentController.postReview);
router.patch(
  "/reviews/:id/moderate",
  requireAuth,
  requireAdmin,
  validateMongoIdParam,
  validateBody(moderateReviewSchema),
  contentController.moderateReview
);

router.get("/faq", contentController.getFaq);
router.post("/faq", requireAuth, requireAdmin, validateBody(faqCreateSchema), contentController.postFaq);

router.post(
  "/newsletter/subscribe",
  validateBody(newsletterSubscribeSchema),
  contentController.newsletterSubscribe
);

export default router;
