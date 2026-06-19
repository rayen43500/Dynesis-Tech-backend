import mongoose from 'mongoose';

import { Message } from '../../../../modules/messages/models/Message.model.js';
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

function mapMessage(doc) {
  if (!doc) return null;
  const item = typeof doc.toObject === 'function' ? doc.toObject({ virtuals: false }) : { ...doc };
  const user = item.userId && typeof item.userId === 'object' ? item.userId : null;

  return {
    _id: item._id?.toString?.() ?? String(item._id),
    name: item.name || '',
    email: item.email || '',
    phone: item.phone || '',
    company: item.company || '',
    subject: item.subject || '',
    message: item.message || '',
    userId: user?._id?.toString() || (typeof item.userId === 'string' ? item.userId : null),
    userName: user?.displayName || '',
    userEmail: user?.email || '',
    isGuest: item.isGuest !== false,
    status: item.status || 'new',
    adminReply: item.adminReply || '',
    adminRepliedAt: item.adminRepliedAt || null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

export const messagesAdminController = {
  list: asyncHandler(async (_req, res) => {
    const items = await Message.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'displayName email')
      .lean();

    return sendSuccess(res, { data: items.map(mapMessage) });
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid id' });
    }

    const doc = await Message.findById(id).populate('userId', 'displayName email');
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Message not found' });

    if (doc.status === 'new') {
      doc.status = 'read';
      await doc.save();
    }

    return sendSuccess(res, { data: mapMessage(doc) });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid id' });
    }

    const patch = {};
    if (req.body.status !== undefined) patch.status = req.body.status;

    const updated = await Message.findByIdAndUpdate(id, { $set: patch }, { new: true })
      .populate('userId', 'displayName email')
      .lean();

    if (!updated) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Message not found' });
    return sendSuccess(res, { data: mapMessage(updated) });
  }),

  remove: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await Message.findByIdAndDelete(id);
    if (!deleted) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Message not found' });
    return sendSuccess(res, { data: { id } });
  }),

  reply: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reply } = req.body;

    const doc = await Message.findById(id);
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Message not found' });

    if (doc.isGuest) {
      const html = `
        <p>Hi ${escapeHtml(doc.name || 'there')},</p>
        <div>${bodyToHtml(reply)}</div>
        <p>— The Dynesis Tech Team<br />hello@dynesistech.com</p>
      `;
      const text = `Hi ${doc.name || 'there'},\n\n${reply}\n\n— The Dynesis Tech Team\nhello@dynesistech.com`;

      await sendEmail({
        to: doc.email,
        subject: 'Re: your message — Dynesis Tech',
        text,
        html
      });
    }

    doc.adminReply = reply;
    doc.adminRepliedAt = new Date();
    doc.status = 'replied';
    await doc.save();

    return res.status(200).json({ success: true });
  })
};
