import mongoose from 'mongoose';

const BugReportSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    reportedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium', index: true },
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open', index: true },
    solution: { type: String, default: '' },
    screenshots: { type: [String], default: [] }
  },
  { timestamps: true }
);

BugReportSchema.index({ assigneeId: 1, status: 1 });

export const BugReport = mongoose.model('BugReport', BugReportSchema);
