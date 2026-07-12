import mongoose from 'mongoose';

const TicketReplySchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, default: '' },
    isStaff: { type: Boolean, default: false },
    attachments: { type: [String], default: [] }
  },
  { timestamps: true }
);

const TicketSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientProfile', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
    subject: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['open', 'in_progress', 'waiting', 'resolved', 'closed'], default: 'open', index: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium', index: true },
    category: { type: String, default: 'general', index: true },
    assignedToId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    replies: { type: [TicketReplySchema], default: [] },
    slaDueAt: { type: Date, default: null },
    resolvedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

TicketSchema.index({ status: 1, priority: 1, updatedAt: -1 });

export const Ticket = mongoose.model('Ticket', TicketSchema);
