import { Router } from 'express';
import { newsletterPublicController } from '../../controllers/public/newsletter.controller.js';

export const newsletterPublicRouter = Router();

newsletterPublicRouter.post('/subscribe', newsletterPublicController.subscribe);
newsletterPublicRouter.get('/unsubscribe', newsletterPublicController.unsubscribe);
newsletterPublicRouter.post('/unsubscribe', newsletterPublicController.unsubscribe);
