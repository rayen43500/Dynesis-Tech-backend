import mongoose from 'mongoose';

const PaymentEventSchema = new mongoose.Schema(
  {
    stripeEventId: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true, index: true },
    status: { type: String, default: 'received', index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    payload: { type: Object, default: {} }
  },
  { timestamps: true }
);

export const PaymentEvent = mongoose.model('PaymentEvent', PaymentEventSchema);

