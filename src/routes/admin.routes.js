import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { validateQuery } from "../middleware/validateQuery.js";
import { validateMongoIdParam } from "../middleware/validateParams.js";
import {
  adminContactsQuerySchema,
  contactStatusSchema,
  portfolioUpdateSchema
} from "../validators/schemas.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/overview", adminController.overview);
router.get("/quotes", adminController.listQuotes);
router.get("/contacts", validateQuery(adminContactsQuerySchema), adminController.listContacts);
router.patch(
  "/contacts/:id",
  validateMongoIdParam,
  validateBody(contactStatusSchema),
  adminController.patchContact
);
router.delete("/portfolio/:id", validateMongoIdParam, adminController.deletePortfolio);
router.patch(
  "/portfolio/:id",
  validateMongoIdParam,
  validateBody(portfolioUpdateSchema),
  adminController.updatePortfolio
);

export default router;
