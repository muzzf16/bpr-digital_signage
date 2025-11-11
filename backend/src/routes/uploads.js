import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import assetService from '../services/assetService.js';
import s3Service from '../services/s3Service.js';

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tmpDir = '/tmp/uploads';
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    cb(null, tmpDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Only allow certain file types
    const allowedMimes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'), false);
    }
  }
});

const router = express.Router();

// Local storage directory
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    let assetUrl, cdnUrl = null;
    let width = null, height = null;
    let fileSize;

    // Process image with Sharp if it's an image file
    if (file.mimetype.startsWith('image/')) {
      // Get original metadata
      const originalMetadata = await sharp(file.path).metadata();
      
      // Resize image maintaining aspect ratio (max 1920x1080)
      const processedImage = sharp(file.path)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true
        });
      
      // Convert to buffer for S3 upload or local processing
      const processedBuffer = await processedImage.toBuffer();
      fileSize = processedBuffer.length;
      
      // Get processed image dimensions
      const processedMetadata = await sharp(processedBuffer).metadata();
      width = processedMetadata.width;
      height = processedMetadata.height;
      
      // Check if we should use S3
      if (process.env.USE_S3 === 'true') {
        // Upload to S3
        const s3FileName = `assets/${Date.now()}_${file.originalname}`;
        cdnUrl = await s3Service.uploadFile(processedBuffer, s3FileName, file.mimetype);
        assetUrl = cdnUrl; // Use CDN URL directly
      } else {
        // Save locally
        const outputFileName = `processed_${Date.now()}_${path.extname(file.originalname)}`;
        const processedFilePath = path.join(UPLOAD_DIR, outputFileName);
        
        // Write processed image to local storage
        await sharp(processedBuffer).toFile(processedFilePath);
        assetUrl = `/public/uploads/${outputFileName}`;
      }
    } else {
      // For non-image files
      fileSize = fs.statSync(file.path).size;
      
      // Check if we should use S3 for non-images too
      if (process.env.USE_S3 === 'true') {
        const buffer = fs.readFileSync(file.path);
        const s3FileName = `assets/${Date.now()}_${file.originalname}`;
        
        cdnUrl = await s3Service.uploadFile(buffer, s3FileName, file.mimetype);
        assetUrl = cdnUrl; // Use CDN URL directly
      } else {
        // Move the file to upload directory
        const finalFileName = `${Date.now()}_${file.originalname}`;
        const processedFilePath = path.join(UPLOAD_DIR, finalFileName);
        
        fs.renameSync(file.path, processedFilePath);
        assetUrl = `/public/uploads/${finalFileName}`;
      }
    }

    // Save DB asset record
    const asset = await assetService.createAsset({
      filename: path.basename(assetUrl),
      url: assetUrl,
      mime: file.mimetype,
      width: width,
      height: height,
      size_bytes: fileSize,
      uploaded_by: req.user?.id || 'system',
      cdn_url: cdnUrl // Store CDN URL if available
    });

    return res.json({ 
      success: true, 
      message: 'File uploaded successfully',
      asset 
    });
  } catch (err) {
    console.error('Upload error:', err);
    
    // Clean up temp file if something went wrong
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    // Handle specific multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'File too large. Maximum size is 10MB.' 
      });
    }
    
    if (err.message === 'File type not allowed') {
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Upload failed',
      error: String(err) 
    });
  }
});

// Endpoint to get asset by ID
router.get('/:id', async (req, res) => {
  try {
    const asset = await assetService.getAssetById(req.params.id);
    if (!asset) {
      return res.status(404).json({ 
        success: false, 
        message: 'Asset not found' 
      });
    }
    res.json({ success: true, asset });
  } catch (err) {
    console.error('Get asset error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve asset',
      error: String(err) 
    });
  }
});

// Endpoint to list all assets
router.get('/', async (req, res) => {
  try {
    const assets = await assetService.getAllAssets();
    res.json({ success: true, count: assets.length, assets });
  } catch (err) {
    console.error('List assets error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve assets',
      error: String(err) 
    });
  }
});

// Endpoint to delete an asset
router.delete('/:id', async (req, res) => {
  try {
    const asset = await assetService.getAssetById(req.params.id);
    if (!asset) {
      return res.status(404).json({ 
        success: false, 
        message: 'Asset not found' 
      });
    }
    
    // Delete the file from disk
    const filePath = path.join(process.cwd(), 'public', asset.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete the record from the database
    await assetService.deleteAsset(req.params.id);
    
    res.json({ success: true, message: 'Asset deleted successfully' });
  } catch (err) {
    console.error('Delete asset error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete asset',
      error: String(err) 
    });
  }
});

export default router;