import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { AppError } from '../middleware/errorHandler.js';
import { buildAvatarKey, isS3Configured, uploadToS3 } from '../config/s3.js';
import { hasPlanFeature, isProfileBoosted, requirePlanFeature } from '../utils/planAccess.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GALLERY_DIR = path.join(__dirname, '../../uploads/gallery');

function getBaseUrl() {
  return process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
}

function ensureGalleryDir() {
  if (!fs.existsSync(GALLERY_DIR)) {
    fs.mkdirSync(GALLERY_DIR, { recursive: true });
  }
}

export async function getPremiumSettings(req, res) {
  const user = req.user;
  return res.json({
    success: true,
    settings: {
      anonymousBrowsing: Boolean(user.anonymousBrowsing),
      profileBoosted: isProfileBoosted(user),
      profileBoostedUntil: user.profileBoostedUntil,
      privateGallery: user.privateGallery || [],
    },
    user: user.toPublicJSON(),
  });
}

export async function updatePremiumSettings(req, res) {
  const { anonymousBrowsing } = req.body || {};

  if (anonymousBrowsing !== undefined) {
    requirePlanFeature(req.user, 'anonymousBrowsing');
    req.user.anonymousBrowsing = Boolean(anonymousBrowsing);
  }

  await req.user.save();

  return res.json({
    success: true,
    settings: {
      anonymousBrowsing: Boolean(req.user.anonymousBrowsing),
      profileBoosted: isProfileBoosted(req.user),
      profileBoostedUntil: req.user.profileBoostedUntil,
      privateGallery: req.user.privateGallery || [],
    },
    user: req.user.toPublicJSON(),
    message: 'Premium settings updated',
  });
}

export async function boostProfile(req, res) {
  requirePlanFeature(req.user, 'profileBoosts');

  if (isProfileBoosted(req.user)) {
    throw new AppError('Your profile is already boosted', 400, 'Already boosted');
  }

  const boostedUntil = new Date();
  boostedUntil.setHours(boostedUntil.getHours() + 24);
  req.user.profileBoostedUntil = boostedUntil;
  await req.user.save();

  return res.json({
    success: true,
    profileBoostedUntil: req.user.profileBoostedUntil,
    user: req.user.toPublicJSON(),
    message: 'Profile boosted for 24 hours',
  });
}

export async function uploadGalleryPhoto(req, res) {
  requirePlanFeature(req.user, 'privateGalleries');

  if (!req.file) {
    throw new AppError('No image file provided. Use field name "photo"', 400, 'Validation error');
  }

  const gallery = req.user.privateGallery || [];
  if (gallery.length >= 12) {
    throw new AppError('Maximum 12 private gallery photos allowed', 400, 'Validation error');
  }

  let photoUrl;
  if (isS3Configured()) {
    const key = buildAvatarKey(req.user._id.toString(), `gallery-${Date.now()}${path.extname(req.file.originalname)}`);
    photoUrl = await uploadToS3({
      key,
      body: req.file.buffer,
      contentType: req.file.mimetype,
    });
  } else {
    ensureGalleryDir();
    const filename = `${req.user._id}-gallery-${Date.now()}${path.extname(req.file.originalname).toLowerCase() || '.jpg'}`;
    const filePath = path.join(GALLERY_DIR, filename);
    fs.writeFileSync(filePath, req.file.buffer);
    photoUrl = `${getBaseUrl()}/uploads/gallery/${filename}`;
  }

  req.user.privateGallery = [...gallery, photoUrl];
  await req.user.save();

  return res.json({
    success: true,
    photoUrl,
    privateGallery: req.user.privateGallery,
    user: req.user.toPublicJSON(),
    message: 'Photo added to private gallery',
  });
}

export async function removeGalleryPhoto(req, res) {
  requirePlanFeature(req.user, 'privateGalleries');

  const { photoUrl } = req.body || {};
  if (!photoUrl) {
    throw new AppError('photoUrl is required', 400, 'Validation error');
  }

  req.user.privateGallery = (req.user.privateGallery || []).filter((url) => url !== photoUrl);
  await req.user.save();

  return res.json({
    success: true,
    privateGallery: req.user.privateGallery,
    user: req.user.toPublicJSON(),
    message: 'Photo removed from private gallery',
  });
}
