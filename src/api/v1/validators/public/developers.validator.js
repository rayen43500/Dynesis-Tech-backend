import { z } from 'zod';

import { objectIdSchema } from '../../../../shared/validators/objectId.js';
import { localizedStringOptionalSchema } from '../../../../shared/validators/localized.js';

export const publicDevelopersListSchema = z.object({
  lang: z.enum(['en', 'fr']).optional(),
  featuredOnly: z.enum(['true', 'false']).optional()
});

export const publicDeveloperIdParamSchema = z.object({ id: objectIdSchema });

export const publicLocalizedStringOptionalSchema = localizedStringOptionalSchema;

