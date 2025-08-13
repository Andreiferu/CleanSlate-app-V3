/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode pentru development
  reactStrictMode: true,
  
  // SWC minification pentru performance
  swcMinify: true,
  
  // Disable source maps în production pentru securitate
  productionBrowserSourceMaps: false,
  
  // ESLint configuration
  eslint: {
    // Warning: permite build-ul chiar dacă sunt warning-uri ESLint
    ignoreDuringBuilds: false,
    dirs: ['pages', 'components', 'hooks', 'context', 'services', 'utils']
  },
  
  // TypeScript configuration (chiar dacă folosești JS)
  typescript: {
    ignoreBuildErrors: false
  },
  
  // Experimental features
  experimental: {
    // Optimizează CSS-ul
    optimizeCss: true,
    
    // Scroll restoration
    scrollRestoration: true,
    
    // Modern JavaScript pentru browsere moderne
    modern: true,
    
    // Optimizează imaginile
    optimizeImages: true
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [], // Adaugă domenii externe dacă ai imagini externe
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  
  // Webpack configuration pentru optimizări
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimizări pentru bundle size
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': __dirname,
      };
    }
    
    // Exclude source maps în production
    if (!dev) {
      config.devtool = false;
    }
    
    return config;
  },
  
  // Environment variables
  env: {
    PWA_NAME: 'CleanSlate v3',
    PWA_SHORT_NAME: 'CleanSlate',
    PWA_DESCRIPTION: 'Digital Life Decluttering Platform',
    PWA_THEME_COLOR: '#2563eb',
    PWA_BACKGROUND_COLOR: '#f8f9fa',
    BUILD_TIME: new Date().toISOString(),
  },
  
  // Headers pentru securitate și performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Performance headers
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/icons/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400', // 1 day
          },
        ],
      },
    ];
  },
  
  // Redirects dacă e necesar
  async redirects() {
    return [
      // Exemplu: redirect de la favicon.ico la iconițe
      {
        source: '/favicon.ico',
        destination: '/icons/icon-192x192.png',
        permanent: true,
      },
    ];
  },
  
  // Rewrites pentru API routes
  async rewrites() {
    return [
      // Exemplu pentru API proxy
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  // Output pentru deployment
  output: 'standalone',
  
  // Compression
  compress: true,
  
  // Power features
  poweredByHeader: false, // Remove "X-Powered-By: Next.js"
  
  // Trailing slash
  trailingSlash: false,
  
  // Generate ETags
  generateEtags: true,
  
  // On-demand entries
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
