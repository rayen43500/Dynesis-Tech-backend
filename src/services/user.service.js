import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Subscription } from "../models/Subscription.js";
import { QuoteRequest } from "../models/QuoteRequest.js";
import { ContactMessage } from "../models/ContactMessage.js";

export async function getDashboard(userId, email) {
  const [subscriptions, quotes, contacts] = await Promise.all([
    Subscription.find({ userId }).sort({ createdAt: -1 }),
    QuoteRequest.find({ email }).sort({ createdAt: -1 }).lean(),
    ContactMessage.find({ email }).sort({ createdAt: -1 }).lean()
  ]);

  const contactRequests = contacts.map((item) => ({
    _id: item._id,
    projectType: item.requestType === "quote" ? "Demande de devis" : item.requestType,
    estimatedBudget: item.company || "Non precise",
    message: item.message,
    createdAt: item.createdAt,
    status: item.status
  }));

  const quoteRequests = [...quotes, ...contactRequests].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  return {
    subscriptionsCount: subscriptions.length,
    activeSubscription: subscriptions.find((s) => s.status === "actif") || null,
    quoteRequests,
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
