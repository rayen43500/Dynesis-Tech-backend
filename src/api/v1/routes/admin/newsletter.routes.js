import { Router } from 'express';
import { newsletterAdminController } from '../../controllers/admin/newsletter.controller.js';

export const newsletterAdminRouter = Router();

newsletterAdminRouter.get('/stats', newsletterAdminController.getStats);
newsletterAdminRouter.get('/subscribers', newsletterAdminController.getSubscribers);
newsletterAdminRouter.post('/subscribers', newsletterAdminController.createSubscriber);
newsletterAdminRouter.delete('/subscribers/:id', newsletterAdminController.deleteSubscriber);
newsletterAdminRouter.get('/campaigns', newsletterAdminController.getCampaigns);
newsletterAdminRouter.post('/send', newsletterAdminController.sendCampaign);
