import mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    label: { type: String, default: '' },
    description: { type: String, default: '' },
    group: { type: String, default: 'general', index: true }
  },
  { timestamps: true }
);

export const Permission = mongoose.model('Permission', PermissionSchema);
