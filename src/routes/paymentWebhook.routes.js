import express from "express";
import { stripe } from "../config/stripe.js";
import { Payment } from "../models/Payment.js";
import { Subscription } from "../models/Subscription.js";

const router = express.Router();

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    const subscription = await Subscription.create({
      userId,
      plan,
      status: "actif",
      startedAt: new Date(),
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    await Payment.create({
      userId,
      subscriptionId: subscription._id,
      stripePaymentIntentId: String(session.payment_intent || session.id),
      amount: Number(session.amount_total || 0),
      status: "succeeded"
    });
  }

  return res.json({ received: true });
});

export default router;
