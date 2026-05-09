import { stripe } from "../config/stripe.js";
import * as webhookService from "../services/webhook.service.js";

export async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    // eslint-disable-next-line no-console
    console.error("STRIPE_WEBHOOK_SECRET manquant.");
    return res.status(500).send("Configuration webhook manquante.");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      await webhookService.handleCheckoutSessionCompleted(session);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Webhook processing error:", e);
    return res.status(500).json({ received: false });
  }

  return res.json({ received: true });
}
