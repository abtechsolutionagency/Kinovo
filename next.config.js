/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com'],
  },
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;