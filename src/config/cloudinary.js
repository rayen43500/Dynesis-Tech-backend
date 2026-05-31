import { env } from './env.js';

export function getCloudinaryConfig() {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    return null; // media module can be enabled later
  }

  return {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    baseFolder: env.CLOUDINARY_BASE_FOLDER || 'dynesis-tech'
  };
}

