import mongoose from 'mongoose';

const MediaAssetSchema = new mongoose.Schema(
  {
    resourceType: { type: String, default: 'image', index: true }, // image/video/raw
    folder: { type: String, default: '', index: true },

    cloudinaryPublicId: { type: String, required: true, index: true, unique: true },
    secureUrl: { type: String, default: '' },

    altText: { type: String, default: '' },
    tags: { type: [String], default: [] },

    // optional audit link to admin uploader
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

MediaAssetSchema.index({ folder: 1, resourceType: 1 });

export const MediaAsset = mongoose.model('MediaAsset', MediaAssetSchema);

