/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configurare pentru PWA
  experimental: {
    appDir: false, // Păstrăm pages router pentru compatibilitate
  },

  // Optimizări pentru imagini
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['cleanslate.app', 'api.cleanslate.app'], // Domeniile pentru imagini externe
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compresie
  compress: true,

  // Headers de securitate
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { 
            key: 'Content-Security-Policy', 
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://api.cleanslate.app; frame-ancestors 'none';"
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Content-Type', value: 'application/manifest+json' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript' },
          { key: 'Service-Worker-Allowed', value: '/' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' }
        ],
      }
    ];
  },

  // Redirects pentru SEO
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Environment variables
  env: {
    PWA_NAME: 'CleanSlate',
    PWA_SHORT_NAME: 'CleanSlate',
    PWA_DESCRIPTION: 'Digital Life Decluttering Platform',
    PWA_THEME_COLOR: '#3b82f6',
    PWA_BACKGROUND_COLOR: '#ffffff',
    APP_VERSION: process.env.npm_package_version || '3.0.0',
  },

  // Webpack customization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom webpack plugins
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BUILD_ID': JSON.stringify(buildId),
        'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
      })
    );

    // Optimizare pentru bundle size
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react': 'preact/compat',
        'react-dom': 'preact/compat'
      };
    }

    return config;
  },

  // Analiza bundle-ului (doar în development)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      if (!isServer) {
        config.plugins.push(
          new (require('@next/bundle-analyzer'))({
            enabled: true,
          })
        );
      }
      return config;
    },
  }),
};

module.exports = nextConfig;
