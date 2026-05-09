import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Subscription } from "../models/Subscription.js";
import { QuoteRequest } from "../models/QuoteRequest.js";

export async function getDashboard(userId, email) {
  const [subscriptions, quotes] = await Promise.all([
    Subscription.find({ userId }).sort({ createdAt: -1 }),
    QuoteRequest.find({ email }).sort({ createdAt: -1 })
  ]);

  return {
    subscriptionsCount: subscriptions.length,
    activeSubscription: subscriptions.find((s) => s.status === "actif") || null,
    quoteRequests: quotes,
    notifications: [
      "Nouvelle version de votre espace client disponible.",
      "Besoin d'un accompagnement ? Contactez Dynesis Tech."
    ],
    news: "Dynesis Tech priorise les demandes en fonction de leur nature."
  };
}

export async function updateProfile(userId, payload) {
  const user = await User.findByIdAndUpdate(userId, payload, { new: true }).select("-passwordHash");
  return user;
}

export async function updatePassword(userId, currentPassword, newPassword) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("Utilisateur introuvable.");
    err.statusCode = 404;
    throw err;
  }
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) {
    const err = new Error("Mot de passe actuel incorrect.");
    err.statusCode = 400;
    throw err;
  }
  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();
  return { message: "Mot de passe mis a jour." };
}
