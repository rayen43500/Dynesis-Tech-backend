import express from "express";
import { stripe } from "../config/stripe.js";
import { requireAuth } from "../middleware/auth.js";
import { Payment } from "../models/Payment.js";

const router = express.Router();

const PRICES = {
  Starter: 4900,
  Business: 9900,
  Premium: 19900
};

router.post("/checkout-session", requireAuth, async (req, res) => {
  const { plan } = req.body;
  const amount = PRICES[plan];
  if (!amount) return res.status(400).json({ message: "Offre invalide." });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: { name: `Dynesis ${plan}` },
          unit_amount: amount
        },
        quantity: 1
      }
    ],
    success_url: `${process.env.FRONTEND_URL}/compte?payment=success`,
    cancel_url: `${process.env.FRONTEND_URL}/abonnements?payment=cancelled`,
    metadata: { userId: req.user.sub, plan }
  });

  return res.json({ url: session.url });
});

router.get("/history", requireAuth, async (req, res) => {
  const rows = await Payment.find({ userId: req.user.sub }).sort({ createdAt: -1 });
  return res.json(rows);
});

export default router;
