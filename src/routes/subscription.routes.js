import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { Subscription } from "../models/Subscription.js";

const router = express.Router();

router.get("/mine", requireAuth, async (req, res) => {
  const rows = await Subscription.find({ userId: req.user.sub }).sort({ createdAt: -1 });
  return res.json(rows);
});

router.post("/select-plan", requireAuth, async (req, res) => {
  const { plan } = req.body;
  const sub = await Subscription.create({
    userId: req.user.sub,
    plan,
    status: "en_attente"
  });
  return res.status(201).json(sub);
});

export default router;
