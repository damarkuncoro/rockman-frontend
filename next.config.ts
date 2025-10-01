import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
