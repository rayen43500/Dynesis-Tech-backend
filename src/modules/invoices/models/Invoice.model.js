import mongoose from 'mongoose';

const InvoiceItemSchema = new mongoose.Schema(
  {
    description: { type: String, default: '' },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 }
  },
  { _id: false }
);

const InvoiceSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientProfile', required: true, index: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null, index: true },
    invoiceNumber: { type: String, default: '', index: true },
    status: {
      type: String,
      enum: ['draft', 'sent', 'partial', 'paid', 'overdue', 'canceled'],
      default: 'draft',
      index: true
    },
    currency: { type: String, default: 'EUR' },
    items: { type: [InvoiceItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    dueDate: { type: Date, default: null },
    issuedAt: { type: Date, default: null },
    paidAt: { type: Date, default: null },
    notes: { type: String, default: '' },
    stripePaymentIntentId: { type: String, default: '' }
  },
  { timestamps: true }
);

InvoiceSchema.index({ clientId: 1, createdAt: -1 });

export const Invoice = mongoose.model('Invoice', InvoiceSchema);
