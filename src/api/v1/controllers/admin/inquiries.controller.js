import mongoose from 'mongoose';

import { Inquiry } from '../../../../modules/inquiries/models/Inquiry.model.js';
import { ClientProfile } from '../../../../modules/clients/models/ClientProfile.model.js';
import { Project } from '../../../../modules/projects/models/Project.model.js';
import { User } from '../../../../modules/users/models/User.model.js';

import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { parsePagination } from '../../../../shared/http/pagination.js';

export const inquiriesAdminController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};

    if (req.query.status) filter.status = String(req.query.status);

    const [items, total] = await Promise.all([
      Inquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Inquiry.countDocuments(filter)
    ]);

    return sendSuccess(res, { data: items, meta: { page, limit, total } });
  }),

  getById: asyncHandler(async (req, res) => {
    const doc = await Inquiry.findById(req.params.id).lean();
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Inquiry not found' });
    return sendSuccess(res, { data: doc });
  }),

  create: asyncHandler(async (req, res) => {
    const doc = await Inquiry.create(req.body);
    return sendSuccess(res, { data: doc });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid id' });
    }

    const updated = await Inquiry.findByIdAndUpdate(id, { $set: req.body }, { new: true }).lean();
    if (!updated) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Inquiry not found' });
    return sendSuccess(res, { data: updated });
  }),

  setStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updated = await Inquiry.findByIdAndUpdate(id, { $set: { status: req.body.status } }, { new: true }).lean();
    if (!updated) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Inquiry not found' });
    return sendSuccess(res, { data: updated });
  }),

  assignConsultation: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updated = await Inquiry.findByIdAndUpdate(
      id,
      {
        $set: {
          assignedConsultantId: req.body.assignedConsultantId ?? null,
          status: 'consultation'
        }
      },
      { new: true }
    ).lean();

    if (!updated) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Inquiry not found' });
    return sendSuccess(res, { data: updated });
  }),

  convertToProject: asyncHandler(async (req, res) => {
    const inquiry = await Inquiry.findById(req.params.id).lean();
    if (!inquiry) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Inquiry not found' });

    // MVP conversion: create/find a client user + client profile by email.
    const email = inquiry.clientInfo?.email;
    if (!email) {
      throw new ApiError({
        statusCode: 400,
        code: 'INQUIRY_MISSING_EMAIL',
        message: 'Cannot convert inquiry without client email'
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      // Create client user record without password (onboarding can be handled in V2).
      user = await User.create({
        email,
        role: 'client',
        displayName: inquiry.clientInfo?.name || inquiry.clientInfo?.company || ''
      });
    }

    const clientProfile = await ClientProfile.findOneAndUpdate(
      { userId: user._id },
      { $set: { companyName: inquiry.clientInfo?.company || '', contactName: inquiry.clientInfo?.name || '', phone: inquiry.clientInfo?.phone || '', location: inquiry.clientInfo?.location || '' } },
      { new: true, upsert: true }
    );

    const project = await Project.create({
      clientId: clientProfile._id,
      title: inquiry.clientInfo?.company ? `${inquiry.clientInfo.company} - ${inquiry.projectType}` : inquiry.projectType,
      status: 'active',
      milestones: [],
      roadmap: [],
      uploadedFiles: (inquiry.uploadedFiles || []).map((f) => ({ assetId: f.assetId })),
      paymentStatus: 'unpaid',
      consultationNotes: inquiry.consultationNotes || '',
      activityTimeline: [{ eventType: 'conversion', message: 'Converted from inquiry', createdAt: new Date() }]
    });

    await Inquiry.findByIdAndUpdate(inquiry._id, { $set: { status: 'converted', convertedProjectId: project._id } });

    return sendSuccess(res, { data: project });
  })
};

