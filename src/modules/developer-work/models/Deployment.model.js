import mongoose from 'mongoose';

const DeploymentSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    version: { type: String, default: '' },
    environment: { type: String, enum: ['dev', 'staging', 'production'], default: 'dev', index: true },
    status: { type: String, enum: ['planned', 'running', 'successful', 'failed', 'rolled_back'], default: 'planned', index: true },
    releaseNotes: { type: String, default: '' },
    deployedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

DeploymentSchema.index({ projectId: 1, createdAt: -1 });

export const Deployment = mongoose.model('Deployment', DeploymentSchema);
