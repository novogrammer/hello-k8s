import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',            // クライアントからくる /api/ 以下のリクエスト
        destination: 'http://backend:4000/:path*', // Docker ネットワーク上の backend:4000 に転送
      },
    ]
  },
};

export default nextConfig;
