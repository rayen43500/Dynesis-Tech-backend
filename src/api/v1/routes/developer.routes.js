import { Router } from 'express';

import { requireDeveloper } from '../middlewares/requireAuth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { developerController } from '../controllers/developer.controller.js';
import {
  developerIdParamSchema,
  leaveRequestSchema,
  taskCommentSchema,
  taskStatusSchema,
  timeEntrySchema
} from '../validators/developer.validator.js';

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
