import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "sun1-23.userapi.com",
      },
      {
        protocol: "https",
        hostname: "sun9-*.userapi.com",
      },
    ],
  },
};

export default nextConfig;
