import { getAllowedOrigins } from '../../../../config/env.js';
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

      const frontendBase = getAllowedOrigins()[0];
      const existingUser = await User.findOne({ email });

      try {
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

        await sendEmail({
          to: email,
          subject: mail.subject,
          text: mail.text,
          html: mail.html
        });
      } catch (mailErr) {
        console.error('Quote confirmation email failed:', mailErr?.message || mailErr);
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
