import { z } from 'zod';

import { objectIdSchema } from '../../../shared/validators/objectId.js';

export const quoteStatusEnum = z.enum(['new', 'reviewed', 'proposal_sent', 'closed']);

export const quoteCreateSchema = z.object({
  projectType: z.string().min(1),
  budget: z.string().min(1),
  timeline: z.string().min(1),
  description: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  wantsDiscoveryCall: z.boolean().optional()
});

export const quoteIdParamSchema = z.object({ id: objectIdSchema });

export const quoteUpdateSchema = z.object({
  status: quoteStatusEnum.optional(),
  adminNotes: z.string().optional()
});

export const quoteSendProposalSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1)
});

export const quoteNotificationsQuerySchema = z.object({
  since: z.string().optional()
});
