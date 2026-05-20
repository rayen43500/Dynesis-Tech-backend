import { QuoteRequest } from "../models/QuoteRequest.js";
import * as emailService from "./email.service.js";

export async function createQuote(data, { userId } = {}) {
  const payload = userId ? { ...data, userId } : data;
  const quote = await QuoteRequest.create(payload);

  const [adminResult, userResult] = await Promise.all([
    emailService.sendQuoteAdminNotification(quote).catch((e) => {
      // eslint-disable-next-line no-console
      console.error("Echec email admin devis:", e);
      return { sent: false, error: true };
    }),
    emailService.sendQuoteUserConfirmation(quote).catch((e) => {
      // eslint-disable-next-line no-console
      console.error("Echec email confirmation devis:", e);
      return { sent: false, error: true };
    })
  ]);

  return {
    quote,
    emails: {
      admin: Boolean(adminResult?.sent),
      user: Boolean(userResult?.sent)
    }
  };
}

export async function listQuotes() {
  return QuoteRequest.find().sort({ createdAt: -1 });
}
