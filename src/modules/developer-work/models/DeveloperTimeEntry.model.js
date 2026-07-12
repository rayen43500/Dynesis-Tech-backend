import mongoose from 'mongoose';

const DeveloperTimeEntrySchema = new mongoose.Schema(
  {
    developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null, index: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeveloperTask', default: null, index: true },
    startedAt: { type: Date, required: true, index: true },
    endedAt: { type: Date, default: null },
    durationMinutes: { type: Number, default: 0 },
    note: { type: String, default: '' },
    source: { type: String, enum: ['timer', 'manual'], default: 'manual' }
  },
  { timestamps: true }
);

DeveloperTimeEntrySchema.index({ developerId: 1, startedAt: -1 });

export const DeveloperTimeEntry = mongoose.model('DeveloperTimeEntry', DeveloperTimeEntrySchema);
