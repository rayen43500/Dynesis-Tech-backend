import { QuoteRequest } from "../models/QuoteRequest.js";
import * as emailService from "./email.service.js";

export async function createQuote(data) {
  const quote = await QuoteRequest.create(data);
  await Promise.all([
    emailService.sendQuoteAdminNotification(quote).catch((e) => {
      // eslint-disable-next-line no-console
      console.error("Echec email admin devis:", e);
    }),
    emailService.sendQuoteUserConfirmation(quote).catch((e) => {
      // eslint-disable-next-line no-console
      console.error("Echec email confirmation devis:", e);
    })
  ]);
  return quote;
}

export async function listQuotes() {
  return QuoteRequest.find().sort({ createdAt: -1 });
}
