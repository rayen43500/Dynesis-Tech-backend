import * as contactService from "../services/contact.service.js";

export async function create(req, res, next) {
  try {
    const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "");
    const row = await contactService.createContactMessage(req.body, ip);
    return res.status(201).json({
      success: true,
      id: row._id,
      message: "Message recu. Nous vous repondrons rapidement."
    });
  } catch (e) {
    return next(e);
  }
}
