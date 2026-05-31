import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: false, select: false },
    role: { type: String, required: true, enum: ['admin', 'client'], index: true },

    displayName: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    isActivated: { type: Boolean, default: false },
    activationToken: { type: String, default: undefined },
    activationTokenExpires: { type: Date, default: undefined }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', UserSchema);

