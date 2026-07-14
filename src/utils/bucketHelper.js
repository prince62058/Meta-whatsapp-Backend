const axios = require("axios");
const { s3Client } = require("../middlewares/multer");
const path = require("path");

const fs = require("fs");

/**
 * Downloads an image from a URL and uploads it to the configured S3/Linode bucket.
 * @param {string} url - The source image URL.
 * @param {string} folderPath - The folder path in the bucket (e.g., "LEADKART/IMAGE/META/").
 * @returns {Promise<string|null>} - The public URL of the uploaded image, or null on failure.
 */
async function uploadUrlToBucket(url, folderPath) {
  try {
    if (!url) return null;

    console.log(`[BUCKET] Downloading image from: ${url}`);
    const response = await axios({
      url,
      method: "GET",
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data, "binary");
    return uploadBufferToBucket(buffer, folderPath, response.headers["content-type"] || "image/jpeg");
  } catch (error) {
    console.error(`[BUCKET] Error uploading URL to bucket: ${error.message}`);
    return null;
  }
}

/**
 * Uploads a local file to the configured S3/Linode bucket.
 * @param {string} filePath - Absolute path to the local file.
 * @param {string} folderPath - The folder path in the bucket.
 * @returns {Promise<string|null>} - The public URL of the uploaded image.
 */
async function uploadLocalFileToBucket(filePath, folderPath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`[BUCKET] Local file not found: ${filePath}`);
      return null;
    }
    const buffer = fs.readFileSync(filePath);
    const contentType = filePath.endsWith(".png") ? "image/png" : "image/jpeg";
    return uploadBufferToBucket(buffer, folderPath, contentType);
  } catch (error) {
    console.error(`[BUCKET] Error uploading local file to bucket: ${error.message}`);
    return null;
  }
}

/**
 * Internal helper to upload a buffer to S3.
 */
async function uploadBufferToBucket(buffer, folderPath, contentType) {
  const fileName = `${Date.now()}_ad_asset.${contentType.split("/")[1]}`;
  const key = `${folderPath}${fileName}`;

  const params = {
    Bucket: process.env.LINODE_OBJECT_BUCKET || "leadkart",
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read",
  };

  console.log(`[BUCKET] Uploading to bucket: ${key}`);
  const uploadResult = await s3Client.upload(params).promise();
  return uploadResult.Location;
}

module.exports = {
  uploadUrlToBucket,
  uploadLocalFileToBucket,
};
