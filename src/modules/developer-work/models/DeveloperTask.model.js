import mongoose from 'mongoose';

const ChecklistItemSchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },
    completed: { type: Boolean, default: false }
  },
  { _id: true }
);

const DeveloperTaskSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    title: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'blocked', 'review', 'testing', 'done'],
      default: 'todo',
      index: true
    },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium', index: true },
    dueDate: { type: Date, default: null, index: true },
    estimatedHours: { type: Number, default: 0 },
    checklist: { type: [ChecklistItemSchema], default: [] },
    completedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

DeveloperTaskSchema.index({ assigneeId: 1, status: 1, dueDate: 1 });

export const DeveloperTask = mongoose.model('DeveloperTask', DeveloperTaskSchema);
