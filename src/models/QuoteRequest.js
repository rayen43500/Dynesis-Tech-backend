import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    industry: { type: String, required: true },
    projectType: {
      type: String,
      enum: [
        "Machine Learning",
        "Intelligence Artificielle",
        "Application web",
        "Application mobile",
        "Site internet",
        "Autres"
      ],
      required: true
    },
    estimatedBudget: { type: String, required: true },
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    status: { type: String, enum: ["nouvelle", "en_cours", "traitee"], default: "nouvelle" }
  },
  { timestamps: true }
);

export const QuoteRequest = mongoose.model("QuoteRequest", quoteSchema);
