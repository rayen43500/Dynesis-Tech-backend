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

  const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000").split(",")[0].trim();

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
    success_url: `${frontendUrl}/compte?payment=success`,
    cancel_url: `${frontendUrl}/abonnements?payment=cancelled`,
    metadata: { userId, plan }
  });

  return { url: session.url };
}

export async function listPaymentHistory(userId) {
  return Payment.find({ userId }).sort({ createdAt: -1 });
}
