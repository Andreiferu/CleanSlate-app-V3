/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Fix pentru development vs production
  productionBrowserSourceMaps: false,
  
  // Error handling îmbunătățit
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Optimizări pentru Vercel
  experimental: {
    optimizeCss: true,
    scrollRestoration: true
  },
  
  eslint: {
    ignoreDuringBuilds: false, // Activează ESLint în build
  },
  
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  
  // Headers pentru securitate
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  
  env: {
    PWA_NAME: 'CleanSlate v3',
    PWA_SHORT_NAME: 'CleanSlate',
    PWA_DESCRIPTION: 'Digital Life Decluttering Platform',
    PWA_THEME_COLOR: '#3b82f6',
    PWA_BACKGROUND_COLOR: '#ffffff',
  },
};

module.exports = nextConfig;
