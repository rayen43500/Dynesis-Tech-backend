import mongoose from 'mongoose';

const DeveloperActivitySchema = new mongoose.Schema(
  {
    developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null, index: true },
    eventType: { type: String, default: '', index: true },
    message: { type: String, default: '' },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

DeveloperActivitySchema.index({ developerId: 1, createdAt: -1 });

export const DeveloperActivity = mongoose.model('DeveloperActivity', DeveloperActivitySchema);
