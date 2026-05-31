import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    jti: { type: String, required: true, index: true },
    revokedAt: { type: Date, default: null, index: true },
    expiresAt: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

export const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

