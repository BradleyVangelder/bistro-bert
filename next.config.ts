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
  webpack: (config, { isServer }) => {
    // Fix for PDF.js canvas dependency issue
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        "canvas/browser": false,
        "canvas/node": false,
      };
      
      // Ignore canvas-related modules that cause build issues
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
        "canvas/browser": false,
        "canvas/node": false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
