import { ClientProfile } from '../../../../modules/clients/models/ClientProfile.model.js';
import { Project } from '../../../../modules/projects/models/Project.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';

async function getClientProfile(userId) {
  const profile = await ClientProfile.findOne({ userId }).lean();
  if (!profile) {
    throw new ApiError({ statusCode: 404, code: 'CLIENT_PROFILE_NOT_FOUND', message: 'Client profile not found' });
  }
  return profile;
}

export const clientProjectsController = {
  list: asyncHandler(async (req, res) => {
    const profile = await getClientProfile(req.user.userId);
    const projects = await Project.find({ clientId: profile._id }).sort({ updatedAt: -1 }).lean();
    return sendSuccess(res, { data: projects });
  }),

  getById: asyncHandler(async (req, res) => {
    const profile = await getClientProfile(req.user.userId);
    const project = await Project.findOne({ _id: req.params.id, clientId: profile._id }).lean();
    if (!project) {
      throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Project not found' });
    }
    return sendSuccess(res, { data: project });
  }),

  roadmap: asyncHandler(async (req, res) => {
    const profile = await getClientProfile(req.user.userId);
    const project = await Project.findOne({ _id: req.params.id, clientId: profile._id })
      .select('title roadmap milestones activityTimeline status updatedAt')
      .lean();
    if (!project) {
      throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Project not found' });
    }
    return sendSuccess(res, { data: project });
  })
};
