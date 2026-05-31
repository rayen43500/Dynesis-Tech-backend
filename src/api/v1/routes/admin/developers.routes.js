import { Router } from 'express';

import { validateRequest } from '../../middlewares/validateRequest.js';
import { developersAdminController } from '../../controllers/admin/developers.controller.js';
import { developerPhotoUpload, developerPortfolioUpload } from '../../../../config/upload.js';

import { developersIdParamSchema, portfolioProjectParamSchema } from '../../validators/admin/developers.validator.js';

export const developersAdminRouter = Router();

developersAdminRouter.get('/', developersAdminController.list);
developersAdminRouter.post('/', developerPhotoUpload.single('photo'), developersAdminController.create);

developersAdminRouter.get('/:id', validateRequest({ params: developersIdParamSchema }), developersAdminController.getById);
developersAdminRouter.put(
  '/:id',
  validateRequest({ params: developersIdParamSchema }),
  developerPhotoUpload.single('photo'),
  developersAdminController.update
);
developersAdminRouter.patch(
  '/:id',
  validateRequest({ params: developersIdParamSchema }),
  developerPhotoUpload.single('photo'),
  developersAdminController.update
);
developersAdminRouter.delete(
  '/:id',
  validateRequest({ params: developersIdParamSchema }),
  developersAdminController.remove
);

developersAdminRouter.post(
  '/:id/photo',
  validateRequest({ params: developersIdParamSchema }),
  developerPhotoUpload.single('photo'),
  developersAdminController.uploadPhoto
);

developersAdminRouter.post(
  '/:id/portfolio',
  validateRequest({ params: developersIdParamSchema }),
  developerPortfolioUpload.array('images', 6),
  developersAdminController.addPortfolio
);

developersAdminRouter.put(
  '/:id/portfolio/:projectId',
  validateRequest({ params: portfolioProjectParamSchema }),
  developerPortfolioUpload.array('images', 6),
  developersAdminController.updatePortfolio
);

developersAdminRouter.delete(
  '/:id/portfolio/:projectId',
  validateRequest({ params: portfolioProjectParamSchema }),
  developersAdminController.removePortfolio
);
