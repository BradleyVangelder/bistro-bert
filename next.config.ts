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
    // Handle canvas package for PDF.js - only in development
    if (isServer && dev) {
      config.externals = config.externals || [];
      config.externals.push({
        'canvas': 'canvas',
        'cairo': 'cairo',
        'pango': 'pango',
        'gdk-pixbuf-2.0': 'gdk-pixbuf-2.0'
      });
    }
    
    // Handle PDF.js worker
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist/build/pdf.worker.entry': 'pdfjs-dist/build/pdf.worker.entry.js',
    };
    
    // Strengthen canvas exclusion for all builds
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'canvas': false,
      'cairo': false,
      'pango': false,
      'gdk-pixbuf-2.0': false,
      'zlib': false,
      'tty': false,
      'fs': false,
      'path': false,
      'os': false
    };
    
    // Add externals for canvas and related dependencies in production
    if (!dev) {
      config.externals = config.externals || [];
      config.externals.push({
        'canvas': 'commonjs canvas',
        'cairo': 'commonjs cairo',
        'pango': 'commonjs pango',
        'gdk-pixbuf-2.0': 'commonjs gdk-pixbuf-2.0'
      });
    }
    
    // Rely on Next.js built-in CSS handling (no custom loaders needed)
    // Custom CSS loader configuration removed to prevent module-not-found errors
    
    return config;
  },
};

export default nextConfig;
