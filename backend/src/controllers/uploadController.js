import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { AppError } from '../middleware/errorHandler.js';
import { buildCoverKey, isS3Configured, uploadToS3 } from '../config/s3.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COVER_DIR = path.join(__dirname, '../../uploads/covers');

function getBaseUrl() {
  return process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
}

export function ensureCoverUploadDir() {
  if (!fs.existsSync(COVER_DIR)) {
    fs.mkdirSync(COVER_DIR, { recursive: true });
  }
  return COVER_DIR;
}

export async function uploadCoverImage(req, res) {
  if (!req.file) {
    throw new AppError('No image file provided. Use field name "image"', 400, 'Validation error');
  }

  const userId = req.user._id.toString();
  let url;

  if (isS3Configured()) {
    const key = buildCoverKey(userId, req.file.originalname);
    url = await uploadToS3({
      key,
      body: req.file.buffer,
      contentType: req.file.mimetype,
    });
  } else {
    ensureCoverUploadDir();
    let ext = path.extname(req.file.originalname || '').toLowerCase();
    if (ext === '.jpeg') ext = '.jpg';
    if (!['.jpg', '.png', '.webp', '.gif'].includes(ext)) ext = '.jpg';
    const filename = `${userId}-${Date.now()}${ext}`;
    fs.writeFileSync(path.join(COVER_DIR, filename), req.file.buffer);
    url = `/uploads/covers/${filename}`;
  }

  const absoluteUrl = url.startsWith('http') ? url : `${getBaseUrl()}${url}`;

  return res.json({
    success: true,
    url,
    image: url,
    imageUrl: absoluteUrl,
    message: 'Image uploaded successfully',
  });
}
