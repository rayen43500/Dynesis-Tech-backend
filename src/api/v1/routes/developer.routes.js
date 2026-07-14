import { Router } from 'express';

import { requireDeveloper } from '../middlewares/requireAuth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { developerController } from '../controllers/developer.controller.js';
import {
  developerIdParamSchema,
  leaveRequestSchema,
  taskCommentSchema,
  taskStatusSchema,
  timeEntrySchema,
  updateDeveloperAccountSchema,
  changeDeveloperPasswordSchema
} from '../validators/developer.validator.js';
import { userPhotoUpload } from '../../../config/upload.js';

export const developerRouter = Router();

developerRouter.use(...requireDeveloper);

developerRouter.get('/dashboard', developerController.dashboard);
developerRouter.get('/projects', developerController.projects);
developerRouter.get('/tasks', developerController.tasks);
developerRouter.patch('/tasks/:id/status', validateRequest({ params: developerIdParamSchema, body: taskStatusSchema }), developerController.updateTaskStatus);
developerRouter.post('/tasks/:id/comments', validateRequest({ params: developerIdParamSchema, body: taskCommentSchema }), developerController.addTaskComment);
developerRouter.get('/time-entries', developerController.timeEntries);
developerRouter.post('/time-entries', validateRequest({ body: timeEntrySchema }), developerController.createTimeEntry);
developerRouter.get('/bugs', developerController.bugs);
developerRouter.get('/deployments', developerController.deployments);
developerRouter.get('/leaves', developerController.leaves);
developerRouter.post('/leaves', validateRequest({ body: leaveRequestSchema }), developerController.requestLeave);

developerRouter.patch(
  '/account',
  userPhotoUpload.single('photo'),
  validateRequest({ body: updateDeveloperAccountSchema }),
  developerController.updateAccount
);

developerRouter.patch(
  '/account/password',
  validateRequest({ body: changeDeveloperPasswordSchema }),
  developerController.changePassword
);
