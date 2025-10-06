import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
    root: process.cwd(),
  },
  outputFileTracingRoot: process.cwd(),
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['images.unsplash.com'],
  },
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
        'canvas': 'canvas'
      });
    }
    
    // Handle PDF.js worker
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist/build/pdf.worker.entry': 'pdfjs-dist/build/pdf.worker.entry.js',
    };
    
    // Ignore canvas in production builds
    if (!dev) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'canvas': false,
        'cairo': false,
        'pango': false,
        'gdk-pixbuf-2.0': false
      };
    }
    
    return config;
  },
};

export default nextConfig;
