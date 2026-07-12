import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    label: { type: String, default: '' },
    permissions: { type: [String], default: [] },
    isSystem: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Role = mongoose.model('Role', RoleSchema);
