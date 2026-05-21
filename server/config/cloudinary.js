const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary if credentials are provided
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'dummy_cloud_name';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

/**
 * Upload a file to Cloudinary or fallback to local storage path
 * @param {string} localFilePath Path to local temp file
 * @returns {Promise<{url: string, public_id?: string}>}
 */
const uploadImage = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    if (isCloudinaryConfigured) {
      // Upload to Cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
        folder: 'modern-furniture-addis',
        resource_type: 'auto',
      });
      
      // Delete local temporary file
      try {
        fs.unlinkSync(localFilePath);
      } catch (err) {
        console.error('Error deleting temp file:', err);
      }

      return {
        url: response.secure_url,
        public_id: response.public_id
      };
    } else {
      // Fallback: copy file from temp upload location to public uploads directory
      // (multer already saves to /uploads directory, so we just return the relative path)
      const filename = path.basename(localFilePath);
      const relativeUrl = `/uploads/${filename}`;
      return {
        url: relativeUrl,
        public_id: filename
      };
    }
  } catch (error) {
    console.error('Error in uploadImage utility:', error);
    // Attempt local fallback in case of Cloudinary failure
    try {
      const filename = path.basename(localFilePath);
      return {
        url: `/uploads/${filename}`,
        public_id: filename
      };
    } catch (fallbackError) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
};

module.exports = {
  cloudinary,
  uploadImage
};
