import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["astronomia"],
  webpack: (config) => {
    config.module.exprContextCritical = false;
    return config;
  },
};

export default nextConfig;