import express from "express";
import { ContactMessage } from "../models/ContactMessage.js";
import { NewsletterSubscriber } from "../models/Content.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    name,
    email,
    phone = "",
    company = "",
    requestType = "quote",
    message,
    invoiceNumber = "",
    projectDetails = "",
    subscribeNewsletter = false
  } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Champs requis manquants (name, email, message)." });
  }

  const emailValue = String(email).toLowerCase();

  const row = await ContactMessage.create({
    name: String(name),
    email: emailValue,
    phone: String(phone || ""),
    company: String(company || ""),
    requestType,
    message: String(message),
    invoiceNumber: String(invoiceNumber || ""),
    projectDetails: String(projectDetails || ""),
    subscribeNewsletter: Boolean(subscribeNewsletter),
    sourceIp: String(req.headers["x-forwarded-for"] || "")
  });

  if (subscribeNewsletter) {
    await NewsletterSubscriber.findOneAndUpdate(
      { email: emailValue },
      { email: emailValue, isActive: true },
      { upsert: true, new: true }
    );
  }

  return res.status(201).json({
    success: true,
    id: row._id,
    message: "Message recu. Nous vous repondrons rapidement."
  });
});

export default router;

