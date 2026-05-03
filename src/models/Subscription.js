import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["Starter", "Business", "Premium"], required: true },
    status: { type: String, enum: ["actif", "expire", "en_attente"], default: "en_attente" },
    stripeSubscriptionId: { type: String },
    startedAt: { type: Date },
    endsAt: { type: Date }
  },
  { timestamps: true }
);

subscriptionSchema.virtual("daysRemaining").get(function getDaysRemaining() {
  if (!this.endsAt) return null;
  const diff = this.endsAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
