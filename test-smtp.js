import 'dotenv/config';
import nodemailer from 'nodemailer';

async function testSmtp() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, '') || process.env.SMTP_PASS;

  console.log(`Testing SMTP with Host: ${host}:${port}, User: ${user}`);
  
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000
  });

  try {
    const res = await transporter.verify();
    console.log('✅ SMTP connection successfully verified!', res);
  } catch (err) {
    console.error('❌ SMTP verification failed:');
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
  }
}

testSmtp();
