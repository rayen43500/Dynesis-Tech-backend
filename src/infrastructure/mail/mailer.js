import nodemailer from 'nodemailer';
import { getMailTransportOptions } from '../../config/mail.js';
import { ApiError } from '../../shared/http/apiErrors.js';
import { env } from '../../config/env.js';

export function createTransporter() {
  const options = getMailTransportOptions();
  if (!options) return null;

  return nodemailer.createTransport(options);
}

export async function sendEmail({ to, subject, text, html }) {
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

