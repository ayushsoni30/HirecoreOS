/**
 * File: server/config/cloudinary.js
 * Description: Cloudinary SDK configuration and helper utility for profile picture uploads.
 *              Falls back to base64 Data URL of the uploaded image if Cloudinary credentials are unset.
 */

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

/**
 * Upload a file buffer to Cloudinary or return Base64 Data URL fallback
 * @param {Buffer} fileBuffer - Buffer from Multer memory storage
 * @param {String} folder - Cloudinary upload folder name
 * @param {String} mimeType - Image mime type (e.g. image/png, image/jpeg)
 * @returns {Promise<String>} - Cloudinary URL or Base64 Data URL
 */
const uploadToCloudinary = (fileBuffer, folder = 'hirecore_avatars', mimeType = 'image/jpeg') => {
  return new Promise((resolve) => {
    // Generate Base64 Data URL so the user's actual uploaded picture is preserved even without Cloudinary keys
    const fallbackDataUrl = fileBuffer 
      ? `data:${mimeType || 'image/jpeg'};base64,${fileBuffer.toString('base64')}`
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary credentials missing in .env. Preserving user image as Base64 Data URL.');
      return resolve(fallbackDataUrl);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
      },
      (error, result) => {
        if (error || !result) {
          console.error('Cloudinary upload error:', error);
          return resolve(fallbackDataUrl);
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary
};
