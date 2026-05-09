import { Subscription } from "../models/Subscription.js";

export async function listMine(userId) {
  return Subscription.find({ userId }).sort({ createdAt: -1 });
}

export async function selectPlan(userId, plan) {
  return Subscription.create({
    userId,
    plan,
    status: "en_attente"
  });
}
