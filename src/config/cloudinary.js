import { env } from './env.js';

export function getCloudinaryConfig() {
  if (env.CLOUDINARY_URL) {
    try {
      const url = new URL(env.CLOUDINARY_URL);
      const cloudName = url.hostname;
      const apiKey = decodeURIComponent(url.username);
      const apiSecret = decodeURIComponent(url.password);

      if (cloudName && apiKey && apiSecret) {
        return {
          cloudName,
          apiKey,
          apiSecret,
          baseFolder: env.CLOUDINARY_BASE_FOLDER || 'dynesis-tech'
        };
      }
    } catch {
      return null;
    }
  }

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

