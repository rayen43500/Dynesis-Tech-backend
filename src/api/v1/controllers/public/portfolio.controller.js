import { PortfolioProject } from '../../../../modules/developers/models/PortfolioProject.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { parsePagination } from '../../../../shared/http/pagination.js';

export const portfolioPublicController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (req.query.featured === 'true') filter.featured = true;
    if (req.query.category) filter.categories = req.query.category;
    if (req.query.q) {
      filter.$or = [
        { 'projectTitle.en': { $regex: req.query.q, $options: 'i' } },
        { 'projectTitle.fr': { $regex: req.query.q, $options: 'i' } },
        { technologies: { $regex: req.query.q, $options: 'i' } }
      ];
    }

    const [items, total] = await Promise.all([
      PortfolioProject.find(filter).sort({ ordering: 1, updatedAt: -1 }).skip(skip).limit(limit).lean(),
      PortfolioProject.countDocuments(filter)
    ]);
    return sendSuccess(res, { data: items, meta: { page, limit, total } });
  }),

  getById: asyncHandler(async (req, res) => {
    const doc = await PortfolioProject.findById(req.params.id).lean();
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Portfolio project not found' });
    return sendSuccess(res, { data: doc });
  })
};
