import mongoose from 'mongoose';

import { Ticket } from '../../../modules/tickets/models/Ticket.model.js';
import { ClientProfile } from '../../../modules/clients/models/ClientProfile.model.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { ApiError } from '../../../shared/http/apiErrors.js';
import { sendSuccess } from '../../../shared/http/apiResponse.js';
import { parsePagination } from '../../../shared/http/pagination.js';

async function getClientProfile(userId) {
  const profile = await ClientProfile.findOne({ userId }).lean();
  if (!profile) throw new ApiError({ statusCode: 404, code: 'CLIENT_PROFILE_NOT_FOUND', message: 'Client profile not found' });
  return profile;
}

export const ticketsClientController = {
  list: asyncHandler(async (req, res) => {
    const profile = await getClientProfile(req.user.userId);
    const tickets = await Ticket.find({ clientId: profile._id }).sort({ updatedAt: -1 }).lean();
    return sendSuccess(res, { data: tickets });
  }),

  create: asyncHandler(async (req, res) => {
    const profile = await getClientProfile(req.user.userId);
    const ticket = await Ticket.create({
      clientId: profile._id,
      userId: req.user.userId,
      subject: req.body.subject,
      description: req.body.description || '',
      priority: req.body.priority || 'medium',
      category: req.body.category || 'general',
      projectId: req.body.projectId || null
    });
    return sendSuccess(res, { data: ticket });
  }),

  getById: asyncHandler(async (req, res) => {
    const profile = await getClientProfile(req.user.userId);
    const ticket = await Ticket.findOne({ _id: req.params.id, clientId: profile._id }).lean();
    if (!ticket) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Ticket not found' });
    return sendSuccess(res, { data: ticket });
  }),

  reply: asyncHandler(async (req, res) => {
    const profile = await getClientProfile(req.user.userId);
    const ticket = await Ticket.findOne({ _id: req.params.id, clientId: profile._id });
    if (!ticket) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Ticket not found' });

    ticket.replies.push({ authorId: req.user.userId, body: req.body.body, isStaff: false });
    if (ticket.status === 'waiting') ticket.status = 'open';
    await ticket.save();
    return sendSuccess(res, { data: ticket.toObject() });
  })
};

export const ticketsAdminController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const [items, total] = await Promise.all([
      Ticket.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
      Ticket.countDocuments(filter)
    ]);
    return sendSuccess(res, { data: items, meta: { page, limit, total } });
  }),

  getById: asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id).lean();
    if (!ticket) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Ticket not found' });
    return sendSuccess(res, { data: ticket });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid id' });
    }
    const updated = await Ticket.findByIdAndUpdate(id, { $set: req.body }, { new: true }).lean();
    if (!updated) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Ticket not found' });
    return sendSuccess(res, { data: updated });
  }),

  reply: asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Ticket not found' });

    ticket.replies.push({ authorId: req.user.userId, body: req.body.body, isStaff: true });
    ticket.status = req.body.status || 'in_progress';
    await ticket.save();
    return sendSuccess(res, { data: ticket.toObject() });
  })
};
