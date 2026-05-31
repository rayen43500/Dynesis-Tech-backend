import cloudinary from 'cloudinary';

import { ApiError } from '../../../shared/http/apiErrors.js';
import { getCloudinaryConfig } from '../../../config/cloudinary.js';

export const mediaService = {
  async signUpload({ folder = '', resourceType = 'image' } = {}) {
    const config = getCloudinaryConfig();
    if (!config) {
      throw new ApiError({ statusCode: 400, code: 'MEDIA_CLOUDINARY_NOT_CONFIGURED', message: 'Cloudinary is not configured' });
    }

    cloudinary.v2.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret
    });

    const timestamp = Math.floor(Date.now() / 1000);

    const publicIdPrefix = folder ? folder.replace(/^\//, '').replace(/\/$/, '') : config.baseFolder;
    const uploadFolder = [config.baseFolder, publicIdPrefix].filter(Boolean).join('/');

    // Params used for Cloudinary signature.
    const signature = cloudinary.v2.utils.api_sign_request(
      {
        timestamp,
        folder: uploadFolder,
        resource_type: resourceType
      },
      config.apiSecret
    );

    const uploadUrl = `https://api.cloudinary.com/v1_1/${config.cloudName}/${resourceType}/upload`;

    return {
      apiKey: config.apiKey,
      cloudName: config.cloudName,
      timestamp,
      signature,
      uploadUrl,
      folder: uploadFolder
    };
  }
};

