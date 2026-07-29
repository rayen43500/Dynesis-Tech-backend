import { getAllowedOrigins } from '../../../../config/env.js';
import { sendEmail } from '../../../../infrastructure/mail/mailer.js';
import { newsletterWelcomeEmailTemplate } from '../../../../infrastructure/mail/emailTemplates.js';
import { NewsletterSubscriber } from '../../../../modules/newsletter/models/NewsletterSubscriber.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

export const newsletterPublicController = {
  subscribe: asyncHandler(async (req, res) => {
    const { email, source } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    let subscriber = await NewsletterSubscriber.findOne({ email: cleanEmail });

    if (subscriber) {
      if (subscriber.status === 'active') {
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed to our newsletter!',
          alreadySubscribed: true
        });
      }

      // Re-activate subscription if previously unsubscribed
      subscriber.status = 'active';
      subscriber.subscribedAt = new Date();
      subscriber.unsubscribedAt = null;
      if (source) subscriber.source = source;
      await subscriber.save();
    } else {
      subscriber = await NewsletterSubscriber.create({
        email: cleanEmail,
        source: source || 'footer'
      });
    }

    // Send confirmation welcome email asynchronously
    const frontendBase = getAllowedOrigins()[0] || 'https://dynesis.tech';
    const unsubscribeUrl = `${frontendBase}/newsletter/unsubscribe?email=${encodeURIComponent(cleanEmail)}&token=${subscriber.unsubscribeToken}`;

    try {
      const mail = newsletterWelcomeEmailTemplate({
        email: cleanEmail,
        unsubscribeUrl
      });
      await sendEmail({
        to: cleanEmail,
        subject: mail.subject,
        text: mail.text,
        html: mail.html
      });
    } catch (mailErr) {
      console.error('Newsletter welcome email failed:', mailErr?.message || mailErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!'
    });
  }),

  unsubscribe: asyncHandler(async (req, res) => {
    const email = req.query.email || req.body?.email;
    const token = req.query.token || req.body?.token;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const subscriber = await NewsletterSubscriber.findOne({ email: cleanEmail });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber email not found'
      });
    }

    if (token && subscriber.unsubscribeToken !== token) {
      return res.status(403).json({
        success: false,
        message: 'Invalid unsubscribe token'
      });
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    if (req.accepts('html')) {
      return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Unsubscribed - Dynesis Tech</title>
          <style>
            body { font-family: Inter, Arial, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
            .card { background: #1e293b; padding: 40px; border-radius: 16px; text-align: center; max-width: 480px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            h1 { color: #38bdf8; margin-bottom: 12px; font-size: 24px; }
            p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
            a { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #0ea5e9; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Successfully Unsubscribed</h1>
            <p>You have been removed from the Dynesis Tech newsletter mailing list. We're sorry to see you go!</p>
            <a href="/">Return to Home</a>
          </div>
        </body>
        </html>
      `);
    }

    return res.status(200).json({
      success: true,
      message: 'You have been unsubscribed from the newsletter.'
    });
  })
};
