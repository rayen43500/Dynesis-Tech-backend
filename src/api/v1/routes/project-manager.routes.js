import { Router } from 'express';

import { requireProjectManager } from '../middlewares/requireAuth.middleware.js';
import { projectManagerController } from '../controllers/project-manager.controller.js';

export const projectManagerRouter = Router();

projectManagerRouter.use(...requireProjectManager);

projectManagerRouter.get('/dashboard', projectManagerController.dashboard);
projectManagerRouter.get('/projects', projectManagerController.projects);
