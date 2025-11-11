import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import assetService from '../services/assetService.js';

const upload = multer({ dest: '/tmp/uploads' });
const router = express.Router();

// local storage dir
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'No file' });

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

    // Process image with Sharp if it's an image file
    let finalName;
    if (file.mimetype.startsWith('image/')) {
      // Create thumbnail
      const thumbName = `thumb_${Date.now()}_${file.originalname}`;
      const thumbPath = path.join('/tmp', thumbName);

      await sharp(file.path)
        .resize(1200, 800, { fit: 'inside' })
        .jpeg({ quality: 80 })
        .toFile(thumbPath);

      // Move processed image to public uploads
      finalName = `${Date.now()}_${file.originalname}`;
      const finalPath = path.join(UPLOAD_DIR, finalName);
      fs.renameSync(thumbPath, finalPath);
    } else {
      // For non-image files, just move them
      finalName = `${Date.now()}_${file.originalname}`;
      const finalPath = path.join(UPLOAD_DIR, finalName);
      fs.renameSync(file.path, finalPath);
    }

    // Remove original temp file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Get file metadata if it's an image
    let metadata = {};
    if (file.mimetype.startsWith('image/')) {
      metadata = await sharp(path.join(UPLOAD_DIR, finalName)).metadata();
    }

    // Get file size for non-image files
    let fileSize = metadata.size || null;
    if (!fileSize) {
      const stats = fs.statSync(path.join(UPLOAD_DIR, finalName));
      fileSize = stats.size;
    }

    // Save DB asset record
    const asset = await assetService.createAsset({
      filename: finalName,
      url: `/public/uploads/${finalName}`,
      mime: file.mimetype,
      width: metadata.width || null,
      height: metadata.height || null,
      size_bytes: fileSize,
      uploaded_by: req.user?.id || 'system'
    });

    return res.json({ success: true, asset });
  } catch (err) {
    console.error('Upload error:', err);
    // Clean up temp file if something went wrong
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;