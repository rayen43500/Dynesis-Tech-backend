import { QuoteRequest } from "../models/QuoteRequest.js";

export async function createQuote(data) {
  return QuoteRequest.create(data);
}

export async function listQuotes() {
  return QuoteRequest.find().sort({ createdAt: -1 });
}
