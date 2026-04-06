import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable gzip/brotli compression for faster payload delivery
  compress: true,

  // Minimize production bundle size
  productionBrowserSourceMaps: false,

  // Optimize images if they are ever added later
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Permanent caching headers for static assets
  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
