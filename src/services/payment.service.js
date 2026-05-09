import { stripe } from "../config/stripe.js";
import { Payment } from "../models/Payment.js";

const PRICES = {
  Starter: 4900,
  Business: 9900,
  Premium: 19900
};

export async function createCheckoutSession(userId, plan) {
  const amount = PRICES[plan];
  if (!amount) {
    const err = new Error("Offre invalide.");
    err.statusCode = 400;
    throw err;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    const err = new Error("Paiement indisponible: cle Stripe manquante.");
    err.statusCode = 503;
    throw err;
  }

  const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",")[0]
    .trim()
    .replace(/\/+$/, "");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    client_reference_id: userId,
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
    success_url: `${frontendUrl}/account?payment=success`,
    cancel_url: `${frontendUrl}/pricing?payment=cancelled`,
    metadata: { userId, plan }
  });

  return { url: session.url };
}

export async function listPaymentHistory(userId) {
  return Payment.find({ userId }).sort({ createdAt: -1 });
}
