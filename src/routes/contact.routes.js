import { Router } from "express";
import * as contactController from "../controllers/contact.controller.js";
import { validateBody } from "../middleware/validate.js";
import { contactSchema } from "../validators/schemas.js";

const router = Router();

router.post("/", validateBody(contactSchema), contactController.create);

export default router;
