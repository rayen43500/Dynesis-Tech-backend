import Stripe from 'stripe';
import { env } from './env.js';

export function getStripeClient() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing');
  }
  return new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20'
  });
}

export const stripeWebhookSecret = env.STRIPE_WEBHOOK_SECRET;

