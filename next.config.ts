import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {},

  // Optimize package imports for better tree-shaking
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },

  // Webpack optimizations for bundle splitting
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          // UI libraries chunk (React, Lucide icons)
          "ui-libs": {
            name: "ui-libs",
            chunks: "all",
            test: /node_modules\/(react|react-dom|lucide-react)/,
            priority: 20,
          },
          // Utility libraries chunk (date-fns, etc.)
          utils: {
            name: "utils",
            chunks: "all",
            test: /node_modules\/(date-fns|reading-time)/,
            priority: 15,
          },
          // Vendor chunk for all other node_modules
          vendor: {
            name: "vendor",
            chunks: "all",
            test: /node_modules/,
            priority: 10,
          },
        },
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(withPWA(nextConfig));
