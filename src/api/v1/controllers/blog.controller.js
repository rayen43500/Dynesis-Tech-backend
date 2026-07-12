import mongoose from 'mongoose';

import { Blog } from '../../../modules/blog/models/Blog.model.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { ApiError } from '../../../shared/http/apiErrors.js';
import { sendSuccess } from '../../../shared/http/apiResponse.js';
import { parsePagination } from '../../../shared/http/pagination.js';

export const blogAdminController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (typeof req.query.published === 'string') filter.published = req.query.published === 'true';

    const [items, total] = await Promise.all([
      Blog.find(filter).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments(filter)
    ]);
    return sendSuccess(res, { data: items, meta: { page, limit, total } });
  }),

  create: asyncHandler(async (req, res) => {
    const doc = await Blog.create({
      ...req.body,
      authorId: req.user.userId,
      publishedAt: req.body.published ? new Date() : null
    });
    return sendSuccess(res, { data: doc });
  }),

  update: asyncHandler(async (req, res) => {
    const payload = { ...req.body };
    if (payload.published === true) payload.publishedAt = payload.publishedAt || new Date();
    const updated = await Blog.findByIdAndUpdate(req.params.id, { $set: payload }, { new: true }).lean();
    if (!updated) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Article not found' });
    return sendSuccess(res, { data: updated });
  }),

  remove: asyncHandler(async (req, res) => {
    const removed = await Blog.findByIdAndDelete(req.params.id).lean();
    if (!removed) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Article not found' });
    return sendSuccess(res, { data: { ok: true } });
  })
};

export const blogPublicController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { published: true };
    if (req.query.category) filter.categories = req.query.category;
    if (req.query.tag) filter.tags = req.query.tag;

    const [items, total] = await Promise.all([
      Blog.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments(filter)
    ]);
    return sendSuccess(res, { data: items, meta: { page, limit, total } });
  }),

  getBySlug: asyncHandler(async (req, res) => {
    const doc = await Blog.findOne({ slug: req.params.slug, published: true }).lean();
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Article not found' });
    return sendSuccess(res, { data: doc });
  })
};
