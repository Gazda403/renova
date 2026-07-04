import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prefer modern formats — AVIF is ~50% smaller than WebP on mobile
    formats: ["image/avif", "image/webp"],
    // Tuned to real mobile breakpoints (iPhone SE → 4K desktop)
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920, 2560],
    // Thumbnail / icon sizes served by next/image
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache on Vercel CDN for 1 year — prevents redundant re-encoding
    minimumCacheTTL: 31536000,
  },
  // Allows tree-shaking heavy packages at build time
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default nextConfig;
