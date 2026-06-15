const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/** Serve uploaded files through the Next.js app (same origin). */
export function resolveMediaUrl(url) {
  if (!url) return url;

  if (url.startsWith('/uploads/')) {
    return url;
  }

  const base = API_URL.replace(/\/$/, '');
  if (url.startsWith(`${base}/uploads/`)) {
    return url.slice(base.length);
  }

  return url;
}

/** @deprecated use resolveMediaUrl */
export const resolveAvatarUrl = resolveMediaUrl;
