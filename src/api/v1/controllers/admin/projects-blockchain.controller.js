import crypto from 'crypto';
import mongoose from 'mongoose';

import { Project } from '../../../../modules/projects/models/Project.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';

/**
 * Compute SHA-256 hash for a blockchain entry.
 * The hash covers: projectId + stageTitle + stageIndex + completedAt + previousHash
 */
function computeHash({ projectId, stageTitle, stageIndex, completedAt, previousHash, adminNote }) {
  const data = `${projectId}:${stageTitle}:${stageIndex}:${completedAt.toISOString()}:${previousHash}:${adminNote}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

export const projectsBlockchainController = {
  /**
   * POST /admin/projects/:id/blockchain/complete-stage
   * Body: { stageIndex: number, adminNote?: string }
   * Marks a roadmap stage as completed and appends an immutable blockchain entry.
   */
  completeStage: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid project id' });
    }

    const project = await Project.findById(id);
    if (!project) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Project not found' });

    const { stageIndex, adminNote = '' } = req.body;

    if (typeof stageIndex !== 'number' || stageIndex < 0) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'stageIndex must be a non-negative number' });
    }

    const stage = project.roadmap[stageIndex];
    if (!stage) {
      throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: `Roadmap stage ${stageIndex} not found` });
    }

    // Mark stage completed in roadmap
    project.roadmap[stageIndex].completed = true;
    project.markModified('roadmap');

    // Compute blockchain hash
    const completedAt = new Date();
    const previousEntry = project.blockchainLog[project.blockchainLog.length - 1];
    const previousHash = previousEntry ? previousEntry.hash : '0000000000000000000000000000000000000000000000000000000000000000';

    const hash = computeHash({
      projectId: id,
      stageTitle: stage.title,
      stageIndex,
      completedAt,
      previousHash,
      adminNote
    });

    project.blockchainLog.push({
      stageTitle: stage.title,
      stageIndex,
      completedAt,
      hash,
      previousHash,
      adminNote
    });

    await project.save();

    return sendSuccess(res, { data: project.toObject() });
  }),

  /**
   * GET /admin/projects/:id/blockchain
   * Returns the full blockchain log for a project.
   */
  getLog: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Invalid project id' });
    }

    const project = await Project.findById(id).select('title blockchainLog roadmap').lean();
    if (!project) throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Project not found' });

    return sendSuccess(res, { data: project });
  })
};
