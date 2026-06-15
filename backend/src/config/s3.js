import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { AppError } from '../middleware/errorHandler.js';

const bucket = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_S3_REGION;

let client = null;

export function isS3Configured() {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    bucket &&
    region
  );
}

function getClient() {
  if (!isS3Configured()) {
    throw new AppError('File upload service is not configured', 500, 'Server error');
  }

  if (!client) {
    client = new S3Client({
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  return client;
}

export function getS3PublicUrl(key) {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export async function uploadToS3({ key, body, contentType }) {
  const s3 = getClient();

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return getS3PublicUrl(key);
}

export function buildAvatarKey(userId, originalName) {
  let ext = path.extname(originalName || '').toLowerCase();
  if (ext === '.jpeg') ext = '.jpg';
  if (!['.jpg', '.png', '.webp', '.gif'].includes(ext)) ext = '.jpg';
  return `avatars/${userId}-${Date.now()}${ext}`;
}

export function buildCoverKey(userId, originalName) {
  let ext = path.extname(originalName || '').toLowerCase();
  if (ext === '.jpeg') ext = '.jpg';
  if (!['.jpg', '.png', '.webp', '.gif'].includes(ext)) ext = '.jpg';
  return `covers/${userId}-${Date.now()}${ext}`;
}
