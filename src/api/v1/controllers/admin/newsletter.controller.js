import { getAllowedOrigins } from '../../../../config/env.js';
import { sendEmail } from '../../../../infrastructure/mail/mailer.js';
import { newsletterCampaignEmailTemplate } from '../../../../infrastructure/mail/emailTemplates.js';
import { NewsletterSubscriber } from '../../../../modules/newsletter/models/NewsletterSubscriber.model.js';
import { NewsletterCampaign } from '../../../../modules/newsletter/models/NewsletterCampaign.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

export const newsletterAdminController = {
  getStats: asyncHandler(async (_req, res) => {
    const totalSubscribers = await NewsletterSubscriber.countDocuments();
    const activeSubscribers = await NewsletterSubscriber.countDocuments({ status: 'active' });
    const unsubscribedCount = await NewsletterSubscriber.countDocuments({ status: 'unsubscribed' });
    const totalCampaignsSent = await NewsletterCampaign.countDocuments({ status: 'sent' });

    return res.status(200).json({
      success: true,
      data: {
        totalSubscribers,
        activeSubscribers,
        unsubscribedCount,
        totalCampaignsSent
      }
    });
  }),

  getSubscribers: asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const { status, search } = req.query;

    const filter = {};
    if (status && ['active', 'unsubscribed'].includes(status)) {
      filter.status = status;
    }
    if (search) {
      filter.email = { $regex: search.trim(), $options: 'i' };
    }

    const total = await NewsletterSubscriber.countDocuments(filter);
    const subscribers = await NewsletterSubscriber.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: {
        subscribers,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit) || 1
        }
      }
    });
  }),

  createSubscriber: asyncHandler(async (req, res) => {
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
        return res.status(400).json({
          success: false,
          message: 'Subscriber already exists and is active'
        });
      }
      subscriber.status = 'active';
      subscriber.subscribedAt = new Date();
      subscriber.unsubscribedAt = null;
      await subscriber.save();
    } else {
      subscriber = await NewsletterSubscriber.create({
        email: cleanEmail,
        source: source || 'admin'
      });
    }

    return res.status(201).json({
      success: true,
      data: subscriber,
      message: 'Subscriber added successfully'
    });
  }),

  deleteSubscriber: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subscriber = await NewsletterSubscriber.findById(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    await NewsletterSubscriber.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Subscriber removed successfully'
    });
  }),

  getCampaigns: asyncHandler(async (req, res) => {
    const campaigns = await NewsletterCampaign.find()
      .populate('sentBy', 'displayName email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: campaigns
    });
  }),

  sendCampaign: asyncHandler(async (req, res) => {
    const { subject, content } = req.body;

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Campaign subject is required'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Campaign content is required'
      });
    }

    const activeSubscribers = await NewsletterSubscriber.find({ status: 'active' });

    if (activeSubscribers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active subscribers found to send campaign to'
      });
    }

    const campaign = await NewsletterCampaign.create({
      subject: subject.trim(),
      content: content.trim(),
      sentBy: req.user?._id,
      recipientCount: activeSubscribers.length,
      status: 'sending'
    });

    const frontendBase = getAllowedOrigins()[0] || 'https://dynesis.tech';
    let successCount = 0;
    let mailErrorOccurred = false;

    for (const subscriber of activeSubscribers) {
      const unsubscribeUrl = `${frontendBase}/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.unsubscribeToken}`;
      const mail = newsletterCampaignEmailTemplate({
        subject: subject.trim(),
        content: content.trim(),
        unsubscribeUrl
      });

      try {
        await sendEmail({
          to: subscriber.email,
          subject: mail.subject,
          text: mail.text,
          html: mail.html
        });
        successCount++;
      } catch (err) {
        console.error(`Failed to send campaign email to ${subscriber.email}:`, err?.message || err);
        mailErrorOccurred = true;
      }
    }

    campaign.status = successCount > 0 || !mailErrorOccurred ? 'sent' : 'failed';
    campaign.sentAt = new Date();
    await campaign.save();

    return res.status(200).json({
      success: true,
      message: `Campaign sent successfully to ${successCount} subscriber(s).`,
      data: {
        campaign,
        totalRecipients: activeSubscribers.length,
        delivered: successCount
      }
    });
  })
};
