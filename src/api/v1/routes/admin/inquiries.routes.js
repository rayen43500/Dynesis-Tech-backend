import { Router } from 'express';

import { validateRequest } from '../../middlewares/validateRequest.js';
import { inquiriesAdminController } from '../../controllers/admin/inquiries.controller.js';
import {
  inquiriesIdParamSchema,
  inquiryCreateSchema,
  inquiryUpdateSchema,
  inquirySetStatusSchema,
  inquiryAssignConsultationSchema
} from '../../validators/admin/inquiries.validator.js';

export const inquiriesAdminRouter = Router();

inquiriesAdminRouter.get('/', inquiriesAdminController.list);
inquiriesAdminRouter.get('/:id', validateRequest({ params: inquiriesIdParamSchema }), inquiriesAdminController.getById);
inquiriesAdminRouter.post('/', validateRequest({ body: inquiryCreateSchema }), inquiriesAdminController.create);
inquiriesAdminRouter.patch('/:id', validateRequest({ params: inquiriesIdParamSchema, body: inquiryUpdateSchema }), inquiriesAdminController.update);

inquiriesAdminRouter.patch('/:id/status', validateRequest({ params: inquiriesIdParamSchema, body: inquirySetStatusSchema }), inquiriesAdminController.setStatus);
inquiriesAdminRouter.post('/:id/assign-consultation', validateRequest({ params: inquiriesIdParamSchema, body: inquiryAssignConsultationSchema }), inquiriesAdminController.assignConsultation);
inquiriesAdminRouter.post('/:id/convert-to-project', validateRequest({ params: inquiriesIdParamSchema }), inquiriesAdminController.convertToProject);

