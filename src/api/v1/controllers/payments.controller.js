import { asyncHandler } from '../middlewares/asyncHandler.js';
import { ApiError } from '../../../shared/http/apiErrors.js';

import { getStripeClient, stripeWebhookSecret } from '../../../config/stripe.js';
import { PaymentEvent } from '../../../modules/payments/models/PaymentEvent.model.js';
import { stripePaymentsService } from '../../../modules/payments/services/stripePayments.service.js';

function mapEventStatus(type) {
  if (type === 'checkout.session.completed') return 'completed';
  if (type === 'invoice.payment_succeeded') return 'succeeded';
  if (type === 'invoice.payment_failed') return 'failed';
  return 'processed';
}

export const paymentsController = {
  createCheckoutSession: asyncHandler(async (req, res) => {
    const { amount, currency, successUrl, cancelUrl, metadata } = req.body;
    const result = await stripePaymentsService.createCheckoutSession({
      amount,
      currency,
      successUrl,
      cancelUrl,
      metadata
    });
    return res.status(200).json({ data: result });
  }),

  stripeWebhook: asyncHandler(async (req, res) => {
    if (!stripeWebhookSecret) {
      throw new ApiError({ statusCode: 500, code: 'STRIPE_WEBHOOK_NOT_CONFIGURED', message: 'Missing STRIPE_WEBHOOK_SECRET' });
    }

    const stripe = getStripeClient();
    const sig = req.headers['stripe-signature'];
    if (!sig) {
      throw new ApiError({ statusCode: 400, code: 'STRIPE_WEBHOOK_MISSING_SIGNATURE', message: 'Missing stripe signature header' });
    }

    const signature = Array.isArray(sig) ? sig[0] : sig;
    const event = stripe.webhooks.constructEvent(req.body, signature, stripeWebhookSecret);

    // Idempotency fast-path: if already seen, ack and exit.
    const existing = await PaymentEvent.findOne({ stripeEventId: event.id }).lean();
    if (existing) {
      return res.status(200).json({ received: true, duplicate: true });
    }

    try {
      await PaymentEvent.create({
        stripeEventId: event.id,
        type: event.type,
        status: mapEventStatus(event.type),
        userId: null,
        payload: event
      });
    } catch (err) {
      // Concurrent duplicate delivery: unique index race.
      if (err?.code === 11000) {
        return res.status(200).json({ received: true, duplicate: true });
      }
      throw err;
    }

    // For now we only persist the event. Later we will map event types into invoices/payments domain models.
    return res.status(200).json({ received: true });
  })
};

