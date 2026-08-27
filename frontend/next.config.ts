import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
      {
        source: "/images/:path*",
        destination: "http://localhost:8080/images/:path*",
      },
    ];
  },
};

export default nextConfig;
