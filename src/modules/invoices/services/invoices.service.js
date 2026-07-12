import crypto from 'crypto';

import { Invoice } from '../models/Invoice.model.js';
import { ClientProfile } from '../../clients/models/ClientProfile.model.js';
import { ApiError } from '../../../shared/http/apiErrors.js';

function calcTotals(items = []) {
  let subtotal = 0;
  let taxAmount = 0;
  for (const item of items) {
    const qty = Number(item.quantity) || 1;
    const unit = Number(item.unitPrice) || 0;
    const line = qty * unit;
    subtotal += line;
    taxAmount += line * ((Number(item.taxRate) || 0) / 100);
  }
  return { subtotal, taxAmount, total: subtotal + taxAmount };
}

function nextInvoiceNumber() {
  const year = new Date().getFullYear();
  const suffix = crypto.randomInt(1000, 9999);
  return `INV-${year}-${suffix}`;
}

export const invoicesService = {
  async list(filter = {}, { page = 1, limit = 20, skip = 0 } = {}) {
    const [items, total] = await Promise.all([
      Invoice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Invoice.countDocuments(filter)
    ]);
    return { items, total, page, limit };
  },

  async getById(id) {
    const doc = await Invoice.findById(id).lean();
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Invoice not found' });
    return doc;
  },

  async create(payload) {
    const totals = calcTotals(payload.items);
    const doc = await Invoice.create({
      ...payload,
      invoiceNumber: payload.invoiceNumber || nextInvoiceNumber(),
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      total: totals.total,
      status: payload.status || 'draft',
      issuedAt: payload.status === 'sent' ? new Date() : null
    });
    return doc.toObject();
  },

  async update(id, payload) {
    const existing = await Invoice.findById(id);
    if (!existing) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Invoice not found' });

    if (payload.items) {
      const totals = calcTotals(payload.items);
      existing.items = payload.items;
      existing.subtotal = totals.subtotal;
      existing.taxAmount = totals.taxAmount;
      existing.total = totals.total;
    }

    if (payload.status) existing.status = payload.status;
    if (payload.notes !== undefined) existing.notes = payload.notes;
    if (payload.dueDate !== undefined) existing.dueDate = payload.dueDate;
    if (payload.status === 'sent' && !existing.issuedAt) existing.issuedAt = new Date();

    await existing.save();
    return existing.toObject();
  },

  async recordPayment({ invoiceId, amountPaid, stripePaymentIntentId }) {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Invoice not found' });

    invoice.amountPaid = (invoice.amountPaid || 0) + amountPaid;
    if (stripePaymentIntentId) invoice.stripePaymentIntentId = stripePaymentIntentId;

    if (invoice.amountPaid >= invoice.total) {
      invoice.status = 'paid';
      invoice.paidAt = new Date();
    } else if (invoice.amountPaid > 0) {
      invoice.status = 'partial';
    }

    await invoice.save();
    return invoice.toObject();
  },

  async getClientProfile(userId) {
    const profile = await ClientProfile.findOne({ userId }).lean();
    if (!profile) throw new ApiError({ statusCode: 404, code: 'CLIENT_PROFILE_NOT_FOUND', message: 'Client profile not found' });
    return profile;
  }
};
