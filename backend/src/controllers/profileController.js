import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { User } from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { buildAvatarKey, isS3Configured, uploadToS3 } from '../config/s3.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '../../uploads/avatars');

function getBaseUrl() {
  return process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
}

export async function getProfile(req, res) {
  return res.json({
    success: true,
    user: req.user.toPublicJSON(),
  });
}

export async function updateProfile(req, res) {
  const { name, bio, location, languages } = req.body;
  const user = req.user;

  if (name !== undefined) {
    if (!name.trim()) throw new AppError('Name cannot be empty', 400, 'Validation error');
    user.name = name.trim();
  }
  if (bio !== undefined) user.bio = bio;
  if (location !== undefined) user.location = location;
  if (languages !== undefined) {
    if (!Array.isArray(languages)) throw new AppError('Languages must be an array', 400, 'Validation error');
    user.languages = languages;
  }

  await user.save();

  return res.json({
    success: true,
    user: user.toPublicJSON(),
    message: 'Profile updated successfully',
  });
}

export async function uploadAvatar(req, res) {
  if (!req.file) {
    throw new AppError('No image file provided. Use field name "avatar"', 400, 'Validation error');
  }

  const user = req.user;
  let avatarUrl;

  if (isS3Configured()) {
    const key = buildAvatarKey(user._id.toString(), req.file.originalname);
    avatarUrl = await uploadToS3({
      key,
      body: req.file.buffer,
      contentType: req.file.mimetype,
    });
    user.avatar = avatarUrl;
  } else {
    const filename = `${user._id}-${Date.now()}${path.extname(req.file.originalname).toLowerCase() || '.jpg'}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    fs.writeFileSync(filePath, req.file.buffer);
    const avatarPath = `/uploads/avatars/${filename}`;
    user.avatar = avatarPath;
    avatarUrl = `${getBaseUrl()}${avatarPath}`;
  }

  await user.save();

  return res.json({
    success: true,
    avatarUrl,
    user: user.toPublicJSON(),
    message: 'Profile image uploaded successfully',
  });
}

export async function getInterests(req, res) {
  return res.json({
    success: true,
    interests: req.user.interests || [],
  });
}

export async function updateInterests(req, res) {
  const { interests } = req.body;

  if (!Array.isArray(interests)) {
    throw new AppError('Interests must be an array of strings', 400, 'Validation error');
  }

  if (interests.length > 20) {
    throw new AppError('Maximum 20 interests allowed', 400, 'Validation error');
  }

  req.user.interests = interests.map((i) => String(i).trim()).filter(Boolean);
  await req.user.save();

  return res.json({
    success: true,
    interests: req.user.interests,
    user: req.user.toPublicJSON(),
    message: 'Travel interests updated successfully',
  });
}

export async function getPreferences(req, res) {
  return res.json({
    success: true,
    travelPreferences: req.user.travelPreferences || {},
  });
}

export async function updatePreferences(req, res) {
  const allowed = ['budget', 'travelStyle', 'accommodation', 'tripDuration', 'nightlife', 'adventure', 'culture', 'beach'];
  const updates = req.body;

  if (!updates || typeof updates !== 'object') {
    throw new AppError('Invalid preferences body', 400, 'Validation error');
  }

  if (!req.user.travelPreferences) {
    req.user.travelPreferences = {};
  }

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      req.user.travelPreferences[key] = updates[key];
    }
  }

  req.user.markModified('travelPreferences');
  await req.user.save();

  return res.json({
    success: true,
    travelPreferences: req.user.travelPreferences,
    user: req.user.toPublicJSON(),
    message: 'Travel preferences updated successfully',
  });
}

export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  return UPLOAD_DIR;
}
