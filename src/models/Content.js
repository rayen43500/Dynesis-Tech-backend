import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    title: String,
    imageUrl: String,
    mission: String,
    technologies: [String],
    result: String
  },
  { timestamps: true }
);

const reviewSchema = new mongoose.Schema(
  {
    author: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    isApproved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const faqSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const PortfolioProject = mongoose.model("PortfolioProject", portfolioSchema);
export const Review = mongoose.model("Review", reviewSchema);
export const FAQ = mongoose.model("FAQ", faqSchema);
export const NewsletterSubscriber = mongoose.model("NewsletterSubscriber", newsletterSchema);
