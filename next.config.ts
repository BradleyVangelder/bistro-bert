import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // turbopack: {
    //   root: process.cwd(),
    // },
  outputFileTracingRoot: process.cwd(),
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['images.unsplash.com', 'localhost'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    qualities: [80, 85, 90],
    // Enable unoptimized for debugging
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    scrollRestoration: true,
  },
  // Font optimization
  optimizeFonts: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer, dev }) => {
    // Completely exclude canvas and all related native dependencies
    config.externals = config.externals || [];

    // Always exclude canvas and native dependencies for production
    if (!dev) {
      config.externals.push({
        'canvas': 'commonjs canvas',
        'cairo': 'commonjs cairo',
        'pango': 'commonjs pango',
        'gdk-pixbuf-2.0': 'commonjs gdk-pixbuf-2.0',
        'pangocairo': 'commonjs pangocairo',
        'pixman-1': 'commonjs pixman-1',
        'fontconfig': 'commonjs fontconfig',
        'freetype2': 'commonjs freetype2',
        'harfbuzz': 'commonjs harfbuzz',
        'libpng': 'commonjs libpng',
        'libjpeg': 'commonjs libjpeg',
        'giflib': 'commonjs giflib'
      });
    }

    // Handle canvas only in development server-side
    if (isServer && dev) {
      config.externals.push({
        'canvas': 'canvas',
        'cairo': 'cairo',
        'pango': 'pango',
        'gdk-pixbuf-2.0': 'gdk-pixbuf-2.0'
      });
    }

    // Comprehensive fallbacks for all canvas-related modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'canvas': false,
      'cairo': false,
      'pango': false,
      'pangocairo': false,
      'gdk-pixbuf-2.0': false,
      'pixman-1': false,
      'fontconfig': false,
      'freetype2': false,
      'harfbuzz': false,
      'libpng': false,
      'libjpeg': false,
      'giflib': false,
      'zlib': false,
      'tty': false,
      'fs': false,
      'path': false,
      'os': false,
      'worker_threads': false
    };

    // Handle PDF.js worker
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist/build/pdf.worker.entry': 'pdfjs-dist/build/pdf.worker.entry.js',
    };

    // Ignore canvas during build
    config.resolve.alias = {
      ...config.resolve.alias,
      'canvas': false,
    };

    return config;
  },
};

export default nextConfig;
