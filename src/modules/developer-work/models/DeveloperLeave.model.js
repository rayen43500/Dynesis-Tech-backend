import mongoose from 'mongoose';

const DeveloperLeaveSchema = new mongoose.Schema(
  {
    developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending', index: true },
    reviewedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewNote: { type: String, default: '' }
  },
  { timestamps: true }
);

DeveloperLeaveSchema.index({ developerId: 1, startDate: -1 });

export const DeveloperLeave = mongoose.model('DeveloperLeave', DeveloperLeaveSchema);
