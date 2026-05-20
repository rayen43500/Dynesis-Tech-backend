import nodemailer from "nodemailer";

function getFrontendBaseUrl() {
  const raw = process.env.FRONTEND_URL || "http://localhost:3000";
  return raw.split(",")[0].trim().replace(/\/+$/, "");
}

function createTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) {
    return null;
  }
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined
  });
}

export function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST?.trim());
}

export async function sendTransactionalEmail({ to, subject, text, html }) {
  const from = process.env.SMTP_FROM || process.env.CONTACT_EMAIL || "noreply@localhost";
  const transport = createTransport();

  if (!transport) {
    // eslint-disable-next-line no-console
    console.warn(
      "[email] SMTP non configure — aucun email envoye. Definissez SMTP_HOST (ex. smtp.gmail.com) dans .env ou sur Render."
    );
    // eslint-disable-next-line no-console
    console.info("[email:dev]", { to, subject, text });
    return { sent: false, dev: true };
  }

  await transport.sendMail({
    from,
    to,
    subject,
    text,
    html: html || text
  });
  return { sent: true, dev: false };
}

export async function sendVerifyEmail(to, token) {
  const base = getFrontendBaseUrl();
  const verifyUrl = `${base}/verify-email?token=${encodeURIComponent(token)}`;
  const subject = "Confirmez votre adresse email - Dynesis Tech";
  const text = `Bonjour,\n\nConfirmez votre compte en ouvrant ce lien :\n${verifyUrl}\n\nLe lien expire sous 48 heures.\n\nDynesis Tech`;
  const result = await sendTransactionalEmail({ to, subject, text });
  return { ...result, verifyUrl };
}

function contactInbox() {
  return process.env.CONTACT_EMAIL || "contact.dynesis@gmail.com";
}

export async function sendQuoteAdminNotification(quote) {
  const to = contactInbox();
  const subject = `[Devis] ${quote.firstName} ${quote.lastName} — ${quote.projectType}`;
  const text = [
    "Nouvelle demande de devis Dynesis Tech",
    "",
    `Nom: ${quote.firstName} ${quote.lastName}`,
    `Email: ${quote.email}`,
    `Telephone: ${quote.phone}`,
    `Secteur: ${quote.industry}`,
    `Type: ${quote.projectType}`,
    `Budget: ${quote.estimatedBudget}`,
    "",
    "Message:",
    quote.message
  ].join("\n");
  return sendTransactionalEmail({ to, subject, text });
}

export async function sendQuoteUserConfirmation(quote) {
  const subject = "Demande de devis recue — Dynesis Tech";
  const text = [
    `Bonjour ${quote.firstName},`,
    "",
    "Nous avons bien recu votre demande de devis.",
    "Notre equipe vous repondra sous 48 heures maximum.",
    "",
    "Recapitulatif:",
    `- Projet: ${quote.projectType}`,
    `- Budget estime: ${quote.estimatedBudget}`,
    "",
    "Dynesis Tech",
    contactInbox()
  ].join("\n");
  return sendTransactionalEmail({ to: quote.email, subject, text });
}

export async function sendPasswordResetEmail(to, token) {
  const base = getFrontendBaseUrl();
  const resetUrl = `${base}/reset-password?token=${encodeURIComponent(token)}`;
  const subject = "Reinitialisation du mot de passe - Dynesis Tech";
  const text = `Bonjour,\n\nReinitialisez votre mot de passe :\n${resetUrl}\n\nLe lien expire sous 1 heure.\n\nSi vous n'etes pas a l'origine de cette demande, ignorez ce message.\n\nDynesis Tech`;
  const result = await sendTransactionalEmail({ to, subject, text });
  return { ...result, verifyUrl: resetUrl };
}
