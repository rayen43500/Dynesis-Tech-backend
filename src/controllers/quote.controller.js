import * as quoteService from "../services/quote.service.js";

export async function create(req, res, next) {
  try {
    const userId = req.user?.sub;
    const { quote, emails } = await quoteService.createQuote(req.body, { userId });

    let message = "Demande enregistrée. Réponse sous 48 heures maximum.";
    if (emails.user) {
      message =
        "Demande enregistrée. Un email de confirmation vous a été envoyé. Réponse sous 48 heures maximum.";
    }

    return res.status(201).json({
      message,
      id: quote._id,
      emailSent: emails.user,
      emailAdminSent: emails.admin
    });
  } catch (e) {
    return next(e);
  }
}

export async function list(req, res, next) {
  try {
    const quotes = await quoteService.listQuotes();
    return res.json(quotes);
  } catch (e) {
    return next(e);
  }
}
