import nodemailer from "nodemailer";

function getFrontendBaseUrl() {
  const raw = process.env.FRONTEND_URL || "http://localhost:3000";
  return raw.split(",")[0].trim();
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

export async function sendTransactionalEmail({ to, subject, text, html }) {
  const from = process.env.SMTP_FROM || process.env.CONTACT_EMAIL || "noreply@localhost";
  const transport = createTransport();

  if (!transport) {
    // eslint-disable-next-line no-console
    console.info("[email:dev]", { to, subject, text: text?.slice(0, 500) });
    return { sent: false, dev: true };
  }

  await transport.sendMail({
    from,
    to,
    subject,
    text,
    html: html || text
  });
  return { sent: true };
}

export async function sendVerifyEmail(to, token) {
  const base = getFrontendBaseUrl();
  const link = `${base}/verify-email?token=${encodeURIComponent(token)}`;
  const subject = "Confirmez votre adresse email — Dynesis Tech";
  const text = `Bonjour,\n\nConfirmez votre compte en ouvrant ce lien :\n${link}\n\nLe lien expire sous 48 heures.\n\n— Dynesis Tech`;
  return sendTransactionalEmail({ to, subject, text });
}

export async function sendPasswordResetEmail(to, token) {
  const base = getFrontendBaseUrl();
  const link = `${base}/reset-password?token=${encodeURIComponent(token)}`;
  const subject = "Reinitialisation du mot de passe — Dynesis Tech";
  const text = `Bonjour,\n\nReinitialisez votre mot de passe :\n${link}\n\nLe lien expire sous 1 heure.\n\nSi vous n'etes pas a l'origine de cette demande, ignorez ce message.\n\n— Dynesis Tech`;
  return sendTransactionalEmail({ to, subject, text });
}
