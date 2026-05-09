import { Router } from "express";
import express from "express";
import * as webhookController from "../controllers/webhook.controller.js";

const router = Router();

router.post("/", express.raw({ type: "application/json" }), webhookController.stripeWebhook);

export default router;
