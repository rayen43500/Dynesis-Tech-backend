import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { invoicesService } from '../../../../modules/invoices/services/invoices.service.js';
import { stripePaymentsService } from '../../../../modules/payments/services/stripePayments.service.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';

export const invoicesClientController = {
  list: asyncHandler(async (req, res) => {
    const profile = await invoicesService.getClientProfile(req.user.userId);
    const result = await invoicesService.list({ clientId: profile._id }, { page: 1, limit: 100, skip: 0 });
    return sendSuccess(res, { data: result.items });
  }),

  getById: asyncHandler(async (req, res) => {
    const profile = await invoicesService.getClientProfile(req.user.userId);
    const doc = await invoicesService.getById(req.params.id);
    if (String(doc.clientId) !== String(profile._id)) {
      throw new ApiError({ statusCode: 403, code: 'FORBIDDEN', message: 'Forbidden' });
    }
    return sendSuccess(res, { data: doc });
  }),

  pay: asyncHandler(async (req, res) => {
    const profile = await invoicesService.getClientProfile(req.user.userId);
    const invoice = await invoicesService.getById(req.params.id);
    if (String(invoice.clientId) !== String(profile._id)) {
      throw new ApiError({ statusCode: 403, code: 'FORBIDDEN', message: 'Forbidden' });
    }

    const remaining = Math.max(0, (invoice.total || 0) - (invoice.amountPaid || 0));
    if (remaining <= 0) {
      throw new ApiError({ statusCode: 400, code: 'INVOICE_ALREADY_PAID', message: 'Invoice already paid' });
    }

    const { successUrl, cancelUrl } = req.body;
    const session = await stripePaymentsService.createCheckoutSession({
      amount: Math.round(remaining * 100),
      currency: (invoice.currency || 'eur').toLowerCase(),
      successUrl,
      cancelUrl,
      metadata: { invoiceId: String(invoice._id), clientId: String(profile._id) }
    });

    return sendSuccess(res, { data: session });
  })
};
