import mongoose from 'mongoose';

import { DeveloperProfile } from '../../../../modules/developers/models/DeveloperProfile.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';
import { parsePagination } from '../../../../shared/http/pagination.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import {
  deleteUploadFile,
  deleteUploadFiles,
  toPublicUploadPath
} from '../../../../config/upload.js';
import { getDeveloperPhoto, parseJsonField } from '../../../../shared/developers/mapDeveloper.js';

function buildDeveloperPayload(body) {
  const data = parseJsonField(body.data, body);

  const payload = {
    fullName: data.fullName || data.name,
    roleTitle: data.roleTitle || data.role || '',
    location: data.location || '',
    biography: data.biography || { en: data.bio || '', fr: data.bio || '' },
    availability: typeof data.availability === 'boolean' ? data.availability : true,
    availabilityStatus: data.availability === false ? 'unavailable' : data.availabilityStatus || 'available',
    memberSince: data.memberSince ? new Date(data.memberSince) : null,
    verifiedBadge: data.isVerified !== undefined ? data.isVerified : data.verifiedBadge !== false,
    expertiseTags: data.expertise || data.expertiseTags || [],
    previousCompanies: data.previousCompanies || [],
    experience: data.experience || [],
    education: data.education || [],
    skills: data.skills || [],
    portfolio: data.portfolio || [],
    yearsOfExperience: data.yearsOfExperience ?? null,
    highlightedExpertise: data.highlightedExpertise || '',
    technologies: data.technologies || [],
    ordering: data.ordering ?? 0,
    visible: data.visible !== false
  };

  if (!payload.fullName) {
    throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Name is required' });
  }

  return payload;
}

function applyDeveloperPatch(existing, body) {
  const data = parseJsonField(body.data, body);

  if (data.fullName !== undefined || data.name !== undefined) {
    existing.fullName = data.fullName || data.name;
  }
  if (data.roleTitle !== undefined || data.role !== undefined) {
    existing.roleTitle = data.roleTitle || data.role || '';
  }
  if (data.location !== undefined) existing.location = data.location;
  if (data.bio !== undefined || data.biography !== undefined) {
    existing.biography = data.biography || { en: data.bio || '', fr: data.bio || '' };
  }
  if (data.availability !== undefined) {
    existing.availability = data.availability;
    existing.availabilityStatus = data.availability ? 'available' : 'unavailable';
  }
  if (data.memberSince !== undefined) {
    existing.memberSince = data.memberSince ? new Date(data.memberSince) : null;
  }
  if (data.isVerified !== undefined || data.verifiedBadge !== undefined) {
    existing.verifiedBadge = data.isVerified !== undefined ? data.isVerified : data.verifiedBadge;
  }
  if (data.expertise !== undefined || data.expertiseTags !== undefined) {
    existing.expertiseTags = data.expertise || data.expertiseTags || [];
  }
  if (data.previousCompanies !== undefined) existing.previousCompanies = data.previousCompanies;
  if (data.experience !== undefined) existing.experience = data.experience;
  if (data.education !== undefined) existing.education = data.education;
  if (data.skills !== undefined) existing.skills = data.skills;
  if (data.portfolio !== undefined) {
    deleteRemovedPortfolioImages(existing.portfolio, data.portfolio);
    existing.portfolio = data.portfolio;
  }
  if (data.visible !== undefined) existing.visible = data.visible;
}

function collectDeveloperFiles(dev) {
  const paths = [];
  if (dev.photo) paths.push(dev.photo);
  paths.push(...collectPortfolioImagePaths(dev.portfolio));
  return paths;
}

function collectPortfolioImagePaths(portfolio = []) {
  const paths = [];
  for (const project of portfolio) {
    for (const img of project.images || []) {
      if (img) paths.push(img);
    }
  }
  return paths;
}

function deleteRemovedPortfolioImages(previousPortfolio, nextPortfolio) {
  const nextPaths = new Set(collectPortfolioImagePaths(nextPortfolio));
  for (const path of collectPortfolioImagePaths(previousPortfolio)) {
    if (!nextPaths.has(path)) deleteUploadFile(path);
  }
}

export const developersAdminController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};

    if (typeof req.query.visible === 'string') {
      filter.visible = req.query.visible === 'true';
    }

    const [items, total] = await Promise.all([
      DeveloperProfile.find(filter).sort({ ordering: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      DeveloperProfile.countDocuments(filter)
    ]);

    return sendSuccess(res, {
      data: items.map((dev) => ({
        id: dev._id.toString(),
        fullName: dev.fullName,
        roleTitle: dev.roleTitle,
        photo: getDeveloperPhoto(dev),
        availability: dev.availability !== false,
        visible: dev.visible !== false,
        verifiedBadge: dev.verifiedBadge !== false,
        expertiseTags: dev.expertiseTags || [],
        portfolioCount: (dev.portfolio || []).length
      })),
      meta: { page, limit, total }
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const doc = await DeveloperProfile.findById(id).lean();
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Developer not found' });
    return sendSuccess(res, { data: { ...doc, id: doc._id.toString(), photo: getDeveloperPhoto(doc) } });
  }),

  create: asyncHandler(async (req, res) => {
    const payload = buildDeveloperPayload(req.body);

    if (req.file) {
      payload.photo = toPublicUploadPath(req.file.filename);
    }

    const doc = await DeveloperProfile.create(payload);
    const obj = doc.toObject();
    return sendSuccess(res, {
      data: { ...obj, id: doc._id.toString(), photo: getDeveloperPhoto(doc) }
    });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid id' });
    }

    const existing = await DeveloperProfile.findById(id);
    if (!existing) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Developer not found' });

    applyDeveloperPatch(existing, req.body);

    if (req.file) {
      deleteUploadFile(existing.photo);
      existing.photo = toPublicUploadPath(req.file.filename);
    }

    if (!existing.fullName) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Name is required' });
    }

    await existing.save();

    const obj = existing.toObject();
    return sendSuccess(res, {
      data: { ...obj, id: existing._id.toString(), photo: getDeveloperPhoto(existing) }
    });
  }),

  remove: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const doc = await DeveloperProfile.findById(id);
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Developer not found' });

    deleteUploadFiles(collectDeveloperFiles(doc));
    await doc.deleteOne();

    return sendSuccess(res, { data: { id } });
  }),

  uploadPhoto: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const doc = await DeveloperProfile.findById(id);
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Developer not found' });
    if (!req.file) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Photo file is required' });
    }

    deleteUploadFile(doc.photo);
    doc.photo = toPublicUploadPath(req.file.filename);
    await doc.save();

    return sendSuccess(res, { data: doc });
  }),

  addPortfolio: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const doc = await DeveloperProfile.findById(id);
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Developer not found' });

    const data = parseJsonField(req.body.data, req.body);
    const images = (req.files || []).map((f) => toPublicUploadPath(f.filename));

    doc.portfolio.push({
      title: data.title || '',
      description: data.description || '',
      overview: data.overview || '',
      brief: data.brief || '',
      challenges: data.challenges || '',
      solutions: data.solutions || '',
      outcomes: data.outcomes || '',
      technologies: data.technologies || parseJsonField(data.technologies, []),
      category: data.category || '',
      images
    });

    await doc.save();
    const project = doc.portfolio[doc.portfolio.length - 1];
    return sendSuccess(res, { data: project });
  }),

  updatePortfolio: asyncHandler(async (req, res) => {
    const { id, projectId } = req.params;
    const doc = await DeveloperProfile.findById(id);
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Developer not found' });

    const project = doc.portfolio.id(projectId);
    if (!project) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Portfolio project not found' });

    const data = parseJsonField(req.body.data, req.body);
    const fields = ['title', 'description', 'overview', 'brief', 'challenges', 'solutions', 'outcomes', 'category'];
    for (const field of fields) {
      if (data[field] !== undefined) project[field] = data[field];
    }
    if (data.technologies !== undefined) {
      project.technologies = Array.isArray(data.technologies) ? data.technologies : parseJsonField(data.technologies, []);
    }

    if (req.files?.length) {
      deleteUploadFiles(project.images || []);
      project.images = req.files.map((f) => toPublicUploadPath(f.filename));
    }

    await doc.save();
    return sendSuccess(res, { data: project });
  }),

  removePortfolio: asyncHandler(async (req, res) => {
    const { id, projectId } = req.params;
    const doc = await DeveloperProfile.findById(id);
    if (!doc) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Developer not found' });

    const project = doc.portfolio.id(projectId);
    if (!project) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Portfolio project not found' });

    deleteUploadFiles(project.images || []);
    project.deleteOne();
    await doc.save();

    return sendSuccess(res, { data: { id: projectId } });
  })
};
