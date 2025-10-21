import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint errors during builds to prevent build failures
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/v2/:path*',
        destination: 'http://localhost:9999/api/v2/:path*',
      },
    ];
  },
};

export default nextConfig;
