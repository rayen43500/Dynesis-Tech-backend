import { z } from 'zod';

export const createCheckoutSessionSchema = z.object({
  amount: z.coerce.number().positive(),
  currency: z.string().min(3).max(3).default('usd'),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  metadata: z.record(z.string()).optional()
});

