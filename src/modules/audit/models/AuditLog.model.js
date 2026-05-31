import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    actorRole: { type: String, default: '' },

    action: { type: String, required: true, index: true }, // e.g. POST /api/v1/admin/services
    resource: { type: String, default: '', index: true }, // e.g. services
    targetId: { type: String, default: '', index: true },

    requestId: { type: String, default: '', index: true },
    method: { type: String, default: '' },
    path: { type: String, default: '' },
    statusCode: { type: Number, default: 0, index: true },

    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

AuditLogSchema.index({ createdAt: -1, actorUserId: 1 });

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

