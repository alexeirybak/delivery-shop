import type { NextConfig } from "next";
 
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/images/products/:path*',
        destination: '/api/uploads/products/:path*',
      },
      {
        source: '/uploads/articles/:path*',
        destination: '/api/uploads/articles/:path*',
      },
      {
        source: '/blogCategories/:path*',           
        destination: '/api/uploads/blog-categories/:path*',
      },
    ];
  },
};
 
export default nextConfig;
 