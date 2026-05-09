import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    stripePaymentIntentId: { type: String, required: true },
    stripeCheckoutSessionId: { type: String, index: true, sparse: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "eur" },
    status: { type: String, enum: ["succeeded", "processing", "failed"], default: "processing" }
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
