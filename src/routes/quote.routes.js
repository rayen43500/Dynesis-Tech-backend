import express from "express";
import { QuoteRequest } from "../models/QuoteRequest.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const quote = await QuoteRequest.create(req.body);

  // Placeholder: brancher un service email SMTP (Nodemailer, Resend, etc.)
  // - Envoi vers contact.dynesis@gmail.com
  // - Accuse de reception au client
  // - Engagement de reponse sous 48h

  return res.status(201).json({
    message: "Demande recue. Reponse sous 48 heures maximum.",
    id: quote._id
  });
});

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const quotes = await QuoteRequest.find().sort({ createdAt: -1 });
  return res.json(quotes);
});

export default router;
