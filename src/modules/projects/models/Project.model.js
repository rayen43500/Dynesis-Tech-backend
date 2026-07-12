import mongoose from 'mongoose';

const RoadmapStageSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    order: { type: Number, default: 0, index: true },
    completed: { type: Boolean, default: false, index: true }
  },
  { _id: false }
);

const MilestoneSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    dueDate: { type: Date, default: null },
    status: { type: String, default: 'planned' },
    notes: { type: String, default: '' }
  },
  { _id: false }
);

const ActivityItemSchema = new mongoose.Schema(
  {
    eventType: { type: String, default: '' },
    message: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientProfile', required: true, index: true },
    projectManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    assignedDeveloperIds: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [], index: true },

    title: { type: String, default: '', index: true },
    status: { type: String, enum: ['active', 'paused', 'completed', 'canceled'], default: 'active', index: true },

    milestones: { type: [MilestoneSchema], default: [] },
    roadmap: { type: [RoadmapStageSchema], default: [] },

    uploadedFiles: {
      type: [
        {
          assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'MediaAsset', required: true }
        }
      ],
      default: []
    },

    invoiceIds: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    paymentStatus: { type: String, default: 'unpaid' },

    consultationNotes: { type: String, default: '' },
    activityTimeline: { type: [ActivityItemSchema], default: [] }
  },
  { timestamps: true }
);

ProjectSchema.index({ clientId: 1, updatedAt: -1 });

export const Project = mongoose.model('Project', ProjectSchema);

