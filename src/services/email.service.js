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
    `Nom : ${quote.firstName} ${quote.lastName}`,
    `Email : ${quote.email}`,
    `Téléphone : ${quote.phone}`,
    `Secteur : ${quote.industry}`,
    `Type : ${quote.projectType}`,
    `Budget : ${quote.estimatedBudget}`,
    "",
    "Message :",
    quote.message,
    "",
    `Référence : ${quote._id}`
  ].join("\n");
  const html = `<p><strong>Nouvelle demande de devis</strong></p>
<ul>
<li><strong>Nom :</strong> ${quote.firstName} ${quote.lastName}</li>
<li><strong>Email :</strong> ${quote.email}</li>
<li><strong>Téléphone :</strong> ${quote.phone}</li>
<li><strong>Secteur :</strong> ${quote.industry}</li>
<li><strong>Type :</strong> ${quote.projectType}</li>
<li><strong>Budget :</strong> ${quote.estimatedBudget}</li>
</ul>
<p><strong>Message :</strong></p>
<p>${String(quote.message).replace(/\n/g, "<br>")}</p>
<p style="color:#64748b;font-size:12px;">Réf. ${quote._id}</p>`;
  return sendTransactionalEmail({ to, subject, text, html });
}

export async function sendQuoteUserConfirmation(quote) {
  const subject = "Demande de devis reçue — Dynesis Tech";
  const text = [
    `Bonjour ${quote.firstName},`,
    "",
    "Nous avons bien reçu votre demande de devis.",
    "Elle est enregistrée dans votre espace client si vous êtes connecté avec cette adresse email.",
    "Notre équipe vous répondra sous 48 heures maximum.",
    "",
    "Récapitulatif :",
    `- Projet : ${quote.projectType}`,
    `- Budget estimé : ${quote.estimatedBudget}`,
    "",
    "Dynesis Tech",
    contactInbox()
  ].join("\n");
  const html = `<p>Bonjour <strong>${quote.firstName}</strong>,</p>
<p>Nous avons bien reçu votre demande de devis. Notre équipe vous répondra sous <strong>48 heures</strong>.</p>
<ul>
<li><strong>Projet :</strong> ${quote.projectType}</li>
<li><strong>Budget estimé :</strong> ${quote.estimatedBudget}</li>
</ul>
<p>Consultez vos demandes dans votre espace client : Devis &amp; documents.</p>
<p>Dynesis Tech — ${contactInbox()}</p>`;
  return sendTransactionalEmail({ to: quote.email, subject, text, html });
}

export async function sendPasswordResetEmail(to, token) {
  const base = getFrontendBaseUrl();
  const resetUrl = `${base}/reset-password?token=${encodeURIComponent(token)}`;
  const subject = "Reinitialisation du mot de passe - Dynesis Tech";
  const text = `Bonjour,\n\nReinitialisez votre mot de passe :\n${resetUrl}\n\nLe lien expire sous 1 heure.\n\nSi vous n'etes pas a l'origine de cette demande, ignorez ce message.\n\nDynesis Tech`;
  const result = await sendTransactionalEmail({ to, subject, text });
  return { ...result, verifyUrl: resetUrl };
}
