import { getStripeClient } from '../../../config/stripe.js';

import { ApiError } from '../../../shared/http/apiErrors.js';

export const stripePaymentsService = {
  async createCheckoutSession({ amount, currency = 'usd', successUrl, cancelUrl, metadata = {} }) {
    const stripe = getStripeClient();

    if (!successUrl || !cancelUrl) {
      throw new ApiError({
        statusCode: 400,
        code: 'PAYMENTS_MISSING_REDIRECTS',
        message: 'successUrl and cancelUrl are required'
      });
    }

    const amountNumber = Number(amount);
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      throw new ApiError({ statusCode: 400, code: 'PAYMENTS_INVALID_AMOUNT', message: 'Invalid amount' });
    }

    // We assume `amount` is in the smallest currency unit (cents).
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: Math.floor(amountNumber),
            product_data: { name: 'Dynesis Tech - Payment' }
          },
          quantity: 1
        }
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata
    });

    return { sessionId: session.id, url: session.url };
  }
};

