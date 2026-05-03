import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    requestType: {
      type: String,
      enum: ["quote", "invoice", "email", "project", "support"],
      default: "quote"
    },
    message: { type: String, required: true },
    invoiceNumber: { type: String, default: "" },
    projectDetails: { type: String, default: "" },
    subscribeNewsletter: { type: Boolean, default: false },
    sourceIp: { type: String, default: "" },
    status: { type: String, enum: ["new", "read", "archived"], default: "new" }
  },
  { timestamps: true }
);

export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

