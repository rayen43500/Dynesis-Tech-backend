import { FAQ, NewsletterSubscriber, PortfolioProject, Review } from "../models/Content.js";

export async function listPortfolio() {
  return PortfolioProject.find().sort({ createdAt: -1 });
}

export async function createPortfolioProject(data) {
  return PortfolioProject.create(data);
}

export async function listApprovedReviews() {
  return Review.find({ isApproved: true }).sort({ createdAt: -1 });
}

export async function createReview(data) {
  return Review.create(data);
}

export async function moderateReview(id, isApproved) {
  const row = await Review.findByIdAndUpdate(
    id,
    { isApproved: Boolean(isApproved) },
    { new: true }
  );
  if (!row) {
    const err = new Error("Avis introuvable.");
    err.statusCode = 404;
    throw err;
  }
  return row;
}

export async function listPublishedFaq() {
  return FAQ.find({ isPublished: true }).sort({ createdAt: -1 });
}

export async function createFaq(data) {
  return FAQ.create(data);
}

export async function subscribeNewsletter(email) {
  const normalized = email.toLowerCase();
  await NewsletterSubscriber.findOneAndUpdate(
    { email: normalized },
    { email: normalized, isActive: true },
    { upsert: true, new: true }
  );
  return { message: "Inscription newsletter confirmee." };
}
