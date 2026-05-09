import * as quoteService from "../services/quote.service.js";

export async function create(req, res, next) {
  try {
    const quote = await quoteService.createQuote(req.body);
    return res.status(201).json({
      message: "Demande recue. Reponse sous 48 heures maximum.",
      id: quote._id
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
