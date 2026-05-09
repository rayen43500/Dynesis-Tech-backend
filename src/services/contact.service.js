import { ContactMessage } from "../models/ContactMessage.js";
import { NewsletterSubscriber } from "../models/Content.js";

export async function createContactMessage(body, sourceIp) {
  const emailValue = body.email.toLowerCase();

  const row = await ContactMessage.create({
    name: body.name,
    email: emailValue,
    phone: body.phone || "",
    company: body.company || "",
    requestType: body.requestType,
    message: body.message,
    invoiceNumber: body.invoiceNumber || "",
    projectDetails: body.projectDetails || "",
    subscribeNewsletter: Boolean(body.subscribeNewsletter),
    sourceIp: sourceIp || ""
  });

  if (body.subscribeNewsletter) {
    await NewsletterSubscriber.findOneAndUpdate(
      { email: emailValue },
      { email: emailValue, isActive: true },
      { upsert: true, new: true }
    );
  }

  return row;
}
