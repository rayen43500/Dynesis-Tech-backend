import mongoose from 'mongoose';

const InvitationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    role: { type: String, required: true, enum: ['admin', 'client', 'developer', 'project_manager'], index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

// Auto-expire invitations after expiry.
InvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Invitation = mongoose.model('Invitation', InvitationSchema);

