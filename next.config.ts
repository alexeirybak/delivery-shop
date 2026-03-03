import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/uploads/:path*",
      },
      {
        source: '/images/products/:path*',
        destination: '/api/uploads/products/:path*',
      },
    ];
  },
};

export default nextConfig;
