import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["astronomia"],
  outputFileTracingRoot: process.cwd(),
  webpack: (config) => {
    config.module.exprContextCritical = false;
    return config;
  },
};

export default nextConfig;