import express from "express";
import bcrypt from "bcryptjs";
import { requireAuth } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Subscription } from "../models/Subscription.js";
import { QuoteRequest } from "../models/QuoteRequest.js";

const router = express.Router();

router.get("/dashboard", requireAuth, async (req, res) => {
  const [subscriptions, quotes] = await Promise.all([
    Subscription.find({ userId: req.user.sub }).sort({ createdAt: -1 }),
    QuoteRequest.find({ email: req.user.email }).sort({ createdAt: -1 })
  ]);

  return res.json({
    subscriptionsCount: subscriptions.length,
    activeSubscription: subscriptions.find((s) => s.status === "actif") || null,
    quoteRequests: quotes,
    notifications: [
      "Nouvelle version de votre espace client disponible.",
      "Besoin d'un accompagnement ? Contactez Dynesis Tech."
    ],
    news: "Dynesis Tech priorise les demandes en fonction de leur nature."
  });
});

router.patch("/profile", requireAuth, async (req, res) => {
  const fields = ["firstName", "lastName", "phone", "privacyAccepted"];
  const payload = {};
  for (const key of fields) {
    if (key in req.body) payload[key] = req.body[key];
  }
  const user = await User.findByIdAndUpdate(req.user.sub, payload, { new: true }).select("-passwordHash");
  return res.json(user);
});

router.patch("/password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.sub);
  if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) return res.status(400).json({ message: "Mot de passe actuel incorrect." });

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  return res.json({ message: "Mot de passe mis a jour." });
});

export default router;
