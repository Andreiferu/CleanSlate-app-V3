/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,  // ← Adaugă asta pentru skip ESLint
  },
  experimental: {
    appDir: false
  },
  // ... rest of config
};

  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },

  compress: true,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' }
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Content-Type', value: 'application/manifest+json' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ],
      }
    ];
  },

  env: {
    PWA_NAME: 'CleanSlate',
    PWA_SHORT_NAME: 'CleanSlate',
    PWA_DESCRIPTION: 'Digital Life Decluttering Platform',
    PWA_THEME_COLOR: '#3b82f6',
    PWA_BACKGROUND_COLOR: '#ffffff'
  }
};

module.exports = nextConfig;
