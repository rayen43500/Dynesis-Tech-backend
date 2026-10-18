import { env } from './env.js';

export function getMailTransportOptions() {
  if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS || !env.SMTP_FROM) {
    return null;
  }

  // Remove spaces that might be present in Gmail App Passwords (e.g. "abcd efgh ijkl mnop")
  const cleanedPass = typeof env.SMTP_PASS === 'string' ? env.SMTP_PASS.replace(/\s+/g, '') : env.SMTP_PASS;

  return {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE ?? false,
    auth: {
      user: env.SMTP_USER,
      pass: cleanedPass
    },
    from: env.SMTP_FROM,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000
  };
}

