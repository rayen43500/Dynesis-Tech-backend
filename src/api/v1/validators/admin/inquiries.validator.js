import { z } from 'zod';

import { objectIdSchema } from '../../../../shared/validators/objectId.js';
import { localizedStringOptionalSchema } from '../../../../shared/validators/localized.js';

const localizedOptional = localizedStringOptionalSchema;

const inquiryUploadedFileSchema = z.object({
  assetId: objectIdSchema
});

const clientInfoSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional()
});

export const inquiryStatusEnum = z.enum(['new', 'contacted', 'assigned', 'consultation', 'converted', 'closed']);

export const inquiriesIdParamSchema = z.object({ id: objectIdSchema });

export const inquiryCreateSchema = z.object({
  projectType: z.string().min(1),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),

  projectDetails: localizedOptional.optional(),

  uploadedFiles: z.array(inquiryUploadedFileSchema).optional(),
  clientInfo: clientInfoSchema.optional(),

  status: inquiryStatusEnum.optional(),
  consultationNotes: z.string().optional()
});

export const inquiryUpdateSchema = inquiryCreateSchema.partial();

export const inquirySetStatusSchema = z.object({
  status: inquiryStatusEnum
});

export const inquiryAssignConsultationSchema = z.object({
  assignedConsultantId: objectIdSchema.optional()
});

