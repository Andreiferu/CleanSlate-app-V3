/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: { ignoreDuringBuilds: true },
  experimental: { appDir: false },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  async headers() {
    return [];
  },
  async rewrites() {
    return [];
  },
  env: {
    PWA_NAME: 'CleanSlate',
    PWA_SHORT_NAME: 'CleanSlate',
    PWA_DESCRIPTION: 'Digital Life Decluttering Platform',
    PWA_THEME_COLOR: '#3b82f6',
    PWA_BACKGROUND_COLOR: '#ffffff',
  },
};

module.exports = nextConfig;
