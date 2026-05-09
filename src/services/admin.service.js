import { QuoteRequest } from "../models/QuoteRequest.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { User } from "../models/User.js";
import { PortfolioProject } from "../models/Content.js";

export async function getOverview() {
  const [quotesCount, contactsCount, usersCount, portfolioCount, recentQuotes] = await Promise.all([
    QuoteRequest.countDocuments(),
    ContactMessage.countDocuments(),
    User.countDocuments(),
    PortfolioProject.countDocuments(),
    QuoteRequest.find().sort({ createdAt: -1 }).limit(8).lean()
  ]);
  return { quotesCount, contactsCount, usersCount, portfolioCount, recentQuotes };
}

export async function listContactsPaginated(limit, skip) {
  const [items, total] = await Promise.all([
    ContactMessage.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ContactMessage.countDocuments()
  ]);
  return { items, total, limit, skip };
}

export async function setContactStatus(id, status) {
  const row = await ContactMessage.findByIdAndUpdate(id, { status }, { new: true });
  if (!row) {
    const err = new Error("Message introuvable.");
    err.statusCode = 404;
    throw err;
  }
  return row;
}

export async function removePortfolio(id) {
  const row = await PortfolioProject.findByIdAndDelete(id);
  if (!row) {
    const err = new Error("Projet introuvable.");
    err.statusCode = 404;
    throw err;
  }
  return { deleted: true, id };
}

export async function patchPortfolio(id, data) {
  const row = await PortfolioProject.findByIdAndUpdate(id, data, { new: true });
  if (!row) {
    const err = new Error("Projet introuvable.");
    err.statusCode = 404;
    throw err;
  }
  return row;
}
