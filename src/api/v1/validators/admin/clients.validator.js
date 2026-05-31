import { z } from 'zod';

import { objectIdSchema } from '../../../../shared/validators/objectId.js';

export const clientsIdParamSchema = z.object({ id: objectIdSchema });

export const clientCreateSchema = z.object({
  email: z.string().email(),
  companyName: z.string().optional(),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  officeLocations: z.array(z.string()).optional(),
  visible: z.boolean().optional()
});

export const clientUpdateSchema = clientCreateSchema.partial();

