import { Router } from 'express';

import { validateRequest } from '../../middlewares/validateRequest.js';
import { projectsAdminController } from '../../controllers/admin/projects.controller.js';
import { projectsIdParamSchema, projectCreateSchemaExport, projectUpdateSchema } from '../../validators/admin/projects.validator.js';

export const projectsAdminRouter = Router();

projectsAdminRouter.get('/', projectsAdminController.list);
projectsAdminRouter.post('/', validateRequest({ body: projectCreateSchemaExport }), projectsAdminController.create);
projectsAdminRouter.get('/:id', validateRequest({ params: projectsIdParamSchema }), projectsAdminController.getById);
projectsAdminRouter.patch('/:id', validateRequest({ params: projectsIdParamSchema, body: projectUpdateSchema }), projectsAdminController.update);

