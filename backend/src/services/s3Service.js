/**
 * S3 Service for asset uploads
 * This service handles uploading assets to S3 and generating presigned URLs
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

class S3Service {
  constructor() {
    // Initialize S3 client with environment variables
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = process.env.S3_BUCKET_NAME;
  }

  /**
   * Upload a file to S3
   * @param {Buffer} fileBuffer - The file buffer to upload
   * @param {string} fileName - The name to give the file in S3
   * @param {string} mimeType - The MIME type of the file
   * @returns {Promise<string>} The S3 URL of the uploaded file
   */
  async uploadFile(fileBuffer, fileName, mimeType) {
    if (!this.bucketName) {
      throw new Error('S3_BUCKET_NAME environment variable is not set');
    }

    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read', // For publicly accessible files
    };

    const command = new PutObjectCommand(params);
    await this.s3Client.send(command);

    return `https://${this.bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`;
  }

  /**
   * Delete a file from S3
   * @param {string} fileName - The name of the file to delete
   * @returns {Promise<boolean>} Whether the deletion was successful
   */
  async deleteFile(fileName) {
    if (!this.bucketName) {
      throw new Error('S3_BUCKET_NAME environment variable is not set');
    }

    const params = {
      Bucket: this.bucketName,
      Key: fileName,
    };

    const command = new DeleteObjectCommand(params);
    await this.s3Client.send(command);
    return true;
  }

  /**
   * Generate a presigned URL for downloading a file
   * @param {string} fileName - The name of the file
   * @param {number} expiresIn - Number of seconds until expiration (default 3600)
   * @returns {Promise<string>} The presigned URL
   */
  async generatePresignedUrl(fileName, expiresIn = 3600) {
    if (!this.bucketName) {
      throw new Error('S3_BUCKET_NAME environment variable is not set');
    }

    const params = {
      Bucket: this.bucketName,
      Key: fileName,
    };

    const command = new GetObjectCommand(params);
    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }
}

// Singleton instance
const s3Service = new S3Service();
export default s3Service;