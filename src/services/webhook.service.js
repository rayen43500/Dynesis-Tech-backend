import mongoose from "mongoose";
import { Payment } from "../models/Payment.js";
import { Subscription } from "../models/Subscription.js";

export async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan;

  if (!userId || !plan) {
    return { skipped: true, reason: "missing_metadata" };
  }

  const sessionId = session.id;
  const existing = await Payment.findOne({ stripeCheckoutSessionId: sessionId });
  if (existing) {
    return { duplicate: true };
  }

  let objectId;
  try {
    objectId = new mongoose.Types.ObjectId(userId);
  } catch {
    return { skipped: true, reason: "invalid_user_id" };
  }

  const subscription = await Subscription.create({
    userId: objectId,
    plan,
    status: "actif",
    startedAt: new Date(),
    endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  await Payment.create({
    userId: objectId,
    subscriptionId: subscription._id,
    stripePaymentIntentId: String(session.payment_intent || session.id),
    stripeCheckoutSessionId: sessionId,
    amount: Number(session.amount_total || 0),
    status: "succeeded"
  });

  return { ok: true };
}
