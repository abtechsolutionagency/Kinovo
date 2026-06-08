/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com', 'localhost'],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return [
      {
        source: '/uploads/:path*',
        destination: `${apiUrl.replace(/\/$/, '')}/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;