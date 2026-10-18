import nodemailer from 'nodemailer';
import { getMailTransportOptions } from '../../config/mail.js';
import { ApiError } from '../../shared/http/apiErrors.js';
import { env } from '../../config/env.js';

export function createTransporter() {
  const options = getMailTransportOptions();
  if (!options) return null;

  return nodemailer.createTransport(options);
}

function parseSender(fromStr) {
  const match = fromStr?.match(/^(.*?)\s*<(.+?)>$/);
  if (match) {
    return { name: match[1].replace(/["']/g, '').trim(), email: match[2].trim() };
  }
  return { name: 'Dynesis Tech', email: fromStr || env.CONTACT_EMAIL || 'contact@dynesistech.fr' };
}

async function sendViaNetlifyRelay({ to, subject, text, html }) {
  const relayUrl =
    env.NETLIFY_MAIL_URL ||
    'https://dynesistech.com/.netlify/functions/send-email';
  const relaySecret = env.EMAIL_RELAY_SECRET || 'dynesis-secure-mail-relay-token-2026';

  const response = await fetch(relayUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${relaySecret}`
    },
    body: JSON.stringify({
      to,
      subject,
      text,
      html,
      from: env.SMTP_FROM || env.CONTACT_EMAIL
    })
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(`Netlify Relay Error (${response.status}): ${JSON.stringify(errorBody)}`);
  }

  return response.json();
}

async function sendViaBrevo({ to, subject, text, html }) {
  const fromInfo = parseSender(env.SMTP_FROM || env.CONTACT_EMAIL);
  const toList = (Array.isArray(to) ? to : [to]).map((e) => ({ email: e }));

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      sender: fromInfo,
      to: toList,
      subject,
      htmlContent: html,
      textContent: text
    })
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(`Brevo API Error (${response.status}): ${JSON.stringify(errorBody)}`);
  }

  return response.json();
}

async function sendViaResend({ to, subject, text, html }) {
  const toList = Array.isArray(to) ? to : [to];

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: env.SMTP_FROM || 'Dynesis Tech <onboarding@resend.dev>',
      to: toList,
      subject,
      html,
      text
    })
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(`Resend API Error (${response.status}): ${JSON.stringify(errorBody)}`);
  }

  return response.json();
}

export async function sendEmail({ to, subject, text, html }) {
  // 1. If Netlify Mail Relay URL is defined OR in production on Render:
  // Netlify communicates over standard HTTPS (Port 443), completely bypassing Render's SMTP port blocks!
  if (env.NETLIFY_MAIL_URL || env.NODE_ENV === 'production') {
    try {
      return await sendViaNetlifyRelay({ to, subject, text, html });
    } catch (relayErr) {
      console.warn('[mail] Netlify relay attempt failed, falling back:', relayErr?.message || relayErr);
    }
  }

  // 2. If Brevo HTTPS API key is configured
  if (env.BREVO_API_KEY) {
    return sendViaBrevo({ to, subject, text, html });
  }

  // 3. If Resend HTTPS API key is configured
  if (env.RESEND_API_KEY) {
    return sendViaResend({ to, subject, text, html });
  }

  // 4. Standard SMTP (works in local dev)
  const transporter = createTransporter();
  if (!transporter) {
    throw new ApiError({
      statusCode: 500,
      code: 'MAIL_NOT_CONFIGURED',
      message: 'Email transport is not configured'
    });
  }

  return transporter.sendMail({
    from: env.SMTP_FROM || env.CONTACT_EMAIL,
    to,
    subject,
    text,
    html
  });
}
