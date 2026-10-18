import { getAllowedOrigins, env } from '../../../../config/env.js';
import { sendEmail } from '../../../../infrastructure/mail/mailer.js';
import {
  quoteBriefReceivedExistingUserEmailTemplate,
  quoteBriefReceivedNewUserEmailTemplate
} from '../../../../infrastructure/mail/emailTemplates.js';
import { Quote } from '../../../../modules/quotes/models/Quote.model.js';
import { User } from '../../../../modules/users/models/User.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

export const quotesPublicController = {
  create: asyncHandler(async (req, res) => {
    try {
      const { projectType, budget, timeline, description, name, email, company, wantsDiscoveryCall } = req.body;

      await Quote.create({
        projectType,
        budget,
        timeline,
        description,
        name,
        email,
        company: company || '',
        wantsDiscoveryCall: Boolean(wantsDiscoveryCall)
      });

      const frontendBase = req.headers.origin || getAllowedOrigins()[0];
      const existingUser = await User.findOne({ email });

      const mail = existingUser
        ? quoteBriefReceivedExistingUserEmailTemplate({
            name,
            projectType,
            budget,
            timeline,
            wantsDiscoveryCall: Boolean(wantsDiscoveryCall),
            loginUrl: `${frontendBase}/login?email=${encodeURIComponent(email)}`
          })
        : quoteBriefReceivedNewUserEmailTemplate({
            name,
            projectType,
            budget,
            timeline,
            wantsDiscoveryCall: Boolean(wantsDiscoveryCall),
            registerUrl: `${frontendBase}/register?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
          });

      // Send client confirmation email asynchronously
      sendEmail({
        to: email,
        subject: mail.subject,
        text: mail.text,
        html: mail.html
      }).catch((mailErr) => {
        console.error('Quote confirmation email failed:', mailErr?.message || mailErr);
      });

      // Notify admin team
      const adminEmail = env.CONTACT_EMAIL;
      if (adminEmail) {
        sendEmail({
          to: adminEmail,
          subject: `[Nouveau Devis] ${name} — ${projectType}`,
          text: `Nouveau devis reçu de ${name} (${email})\nEntreprise: ${company || 'N/A'}\nProjet: ${projectType}\nBudget: ${budget}\nDélai: ${timeline}\n\nDescription:\n${description}`,
          html: `<h3>Nouveau devis reçu</h3><p><strong>Nom :</strong> ${name}<br><strong>Email :</strong> ${email}<br><strong>Entreprise :</strong> ${company || 'N/A'}<br><strong>Projet :</strong> ${projectType}<br><strong>Budget :</strong> ${budget}<br><strong>Délai :</strong> ${timeline}</p><p><strong>Description :</strong><br>${description}</p>`
        }).catch((adminErr) => {
          console.error('Quote admin notification email failed:', adminErr?.message || adminErr);
        });
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err?.message || 'Failed to submit quote request'
      });
    }
  })
};
