import 'dotenv/config';

async function testRelay() {
  const url = process.env.NETLIFY_MAIL_URL || 'https://dynesistech.com/.netlify/functions/send-email';
  const secret = process.env.EMAIL_RELAY_SECRET || 'dynesis-secure-mail-relay-token-2026';

  console.log(`Testing Netlify Mail Relay via HTTPS (Port 443) to: ${url}`);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`
      },
      body: JSON.stringify({
        to: 'contact@dynesistech.fr',
        subject: 'Test Netlify Mail Relay',
        text: 'Ceci est un test de relais via Netlify Function.',
        html: '<p>Ceci est un test de relais via <strong>Netlify Function</strong>.</p>'
      })
    });

    const status = res.status;
    const data = await res.json().catch(() => ({}));

    console.log(`HTTP Status: ${status}`);
    console.log('Response:', data);

    if (res.ok) {
      console.log('✅ Netlify Mail Relay works perfectly over HTTPS!');
    } else {
      console.log('ℹ️ Netlify function responded:', data);
    }
  } catch (err) {
    console.error('❌ Request error:', err.message);
  }
}

testRelay();
