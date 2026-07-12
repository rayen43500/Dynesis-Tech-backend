import mongoose from 'mongoose';

const AttachmentSchema = new mongoose.Schema(
  {
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'MediaAsset', default: null },
    name: { type: String, default: '' },
    url: { type: String, default: '' }
  },
  { _id: false }
);

const TaskCommentSchema = new mongoose.Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeveloperTask', required: true, index: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    body: { type: String, required: true },
    attachments: { type: [AttachmentSchema], default: [] }
  },
  { timestamps: true }
);

TaskCommentSchema.index({ taskId: 1, createdAt: -1 });

export const TaskComment = mongoose.model('TaskComment', TaskCommentSchema);
