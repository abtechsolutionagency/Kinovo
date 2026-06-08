const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/** Serve uploaded avatars through the Next.js app (same origin). */
export function resolveAvatarUrl(avatar) {
  if (!avatar) return avatar;

  if (avatar.startsWith('/uploads/')) {
    return avatar;
  }

  const base = API_URL.replace(/\/$/, '');
  if (avatar.startsWith(`${base}/uploads/`)) {
    return avatar.slice(base.length);
  }

  return avatar;
}
