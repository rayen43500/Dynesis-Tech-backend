import mongoose from 'mongoose';

import { Quote } from '../../../../modules/quotes/models/Quote.model.js';
import { sendEmail } from '../../../../infrastructure/mail/mailer.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function bodyToHtml(body) {
  return escapeHtml(body).replace(/\n/g, '<br />');
}

export const quotesAdminController = {
  list: asyncHandler(async (req, res) => {
    const items = await Quote.find().sort({ createdAt: -1 }).lean();
    return sendSuccess(res, { data: items });
  }),

  getById: asyncHandler(async (req, res) => {
    const doc = await Quote.findById(req.params.id).lean();
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Quote not found' });
    return sendSuccess(res, { data: doc });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid id' });
    }

    const patch = {};
    if (req.body.status !== undefined) patch.status = req.body.status;
    if (req.body.adminNotes !== undefined) patch.adminNotes = req.body.adminNotes;

    const updated = await Quote.findByIdAndUpdate(id, { $set: patch }, { new: true }).lean();
    if (!updated) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Quote not found' });
    return sendSuccess(res, { data: updated });
  }),

  remove: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await Quote.findByIdAndDelete(id);
    if (!deleted) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Quote not found' });
    return sendSuccess(res, { data: { id } });
  }),

  notifications: asyncHandler(async (req, res) => {
    const filter = { status: 'new' };

    if (req.query.since) {
      const since = new Date(req.query.since);
      if (!Number.isNaN(since.getTime())) {
        filter.createdAt = { $gt: since };
      }
    }

    const newQuotes = await Quote.countDocuments(filter);
    return res.status(200).json({ newQuotes });
  }),

  sendProposal: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const quote = await Quote.findById(id);
    if (!quote) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Quote not found' });

    const subject = req.body.subject;
    const body = req.body.body;
    const clientName = quote.name || 'there';

    const html = `
      <p>Hi ${escapeHtml(clientName)},</p>
      <div>${bodyToHtml(body)}</div>
      <p>— The Dynesis Tech Team<br />hello@dynesistech.com</p>
    `;

    const text = `Hi ${clientName},\n\n${body}\n\n— The Dynesis Tech Team\nhello@dynesistech.com`;

    await sendEmail({
      to: quote.email,
      subject,
      text,
      html
    });

    quote.status = 'proposal_sent';
    quote.proposalSentAt = new Date();
    quote.proposalSubject = subject;
    quote.proposalBody = body;
    await quote.save();

    return res.status(200).json({ success: true });
  })
};
