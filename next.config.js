/** @type {import('next').NextConfig} */
const nextConfig = {
  // React configuration - CRITICAL pentru Next.js 14.2
  reactStrictMode: false,
  
  // SWC Minification
  swcMinify: true,
  
  // Experimental features pentru stabilitate
  experimental: {
    // Disable app directory pentru compatibilitate
    appDir: false,
    
    // Optimizari pentru Vercel
    optimizePackageImports: ['lucide-react'],
    
    // Disable problematic features
    serverComponentsExternalPackages: [],
  },
  
  // Compiler optimizations
  compiler: {
    // Remove console în production dar păstrează error/warn
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // Webpack configuration pentru framework fixes
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Fix pentru Next.js Link component errors
    if (!dev && !isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      // Suppress specific warnings that cause React errors
      config.ignoreWarnings = [
        { module: /node_modules\/next\// },
        { file: /node_modules\/next\// },
        /Critical dependency/,
      ];
      
      // Optimize chunks pentru a preveni framework errors
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Separate framework chunk
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Headers pentru a preveni cache issues
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects pentru favicon fix
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/icons/icon-192x192.png',
        permanent: true,
      },
    ];
  },
  
  // Build optimizations
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  
  // Environment variables
  env: {
    PWA_NAME: 'CleanSlate v3',
    PWA_SHORT_NAME: 'CleanSlate',
    PWA_DESCRIPTION: 'Digital Life Decluttering Platform',
    PWA_THEME_COLOR: '#2563eb',
    PWA_BACKGROUND_COLOR: '#f8f9fa',
  },
};

module.exports = nextConfig;
