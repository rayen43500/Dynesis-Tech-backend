import express from "express";
import { FAQ, NewsletterSubscriber, PortfolioProject, Review } from "../models/Content.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/portfolio", async (_req, res) => {
  const rows = await PortfolioProject.find().sort({ createdAt: -1 });
  return res.json(rows);
});

router.post("/portfolio", requireAuth, requireAdmin, async (req, res) => {
  const row = await PortfolioProject.create(req.body);
  return res.status(201).json(row);
});

router.get("/reviews", async (_req, res) => {
  const rows = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
  return res.json(rows);
});

router.post("/reviews", async (req, res) => {
  const row = await Review.create(req.body);
  return res.status(201).json(row);
});

router.patch("/reviews/:id/moderate", requireAuth, requireAdmin, async (req, res) => {
  const row = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved: Boolean(req.body.isApproved) },
    { new: true }
  );
  return res.json(row);
});

router.get("/faq", async (_req, res) => {
  const rows = await FAQ.find({ isPublished: true }).sort({ createdAt: -1 });
  return res.json(rows);
});

router.post("/faq", requireAuth, requireAdmin, async (req, res) => {
  const row = await FAQ.create(req.body);
  return res.status(201).json(row);
});

router.post("/newsletter/subscribe", async (req, res) => {
  const email = (req.body.email || "").toLowerCase();
  if (!email) return res.status(400).json({ message: "Email requis." });

  await NewsletterSubscriber.findOneAndUpdate(
    { email },
    { email, isActive: true },
    { upsert: true, new: true }
  );

  return res.json({ message: "Inscription newsletter confirmee." });
});

export default router;
