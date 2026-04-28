import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["astronomia"],
  outputFileTracingRoot: process.cwd(),
  webpack: (config) => {
    config.module.exprContextCritical = false;
    // Tell webpack to skip bundling calculateAstronomia.ts
    // It's server-only code that uses Node.js `require()`
    config.externals = config.externals || [];
    config.externals.push(({ request }: { request: string }) => {
      if (request?.includes("calculateAstronomia")) {
        return `module.exports = {}`;
      }
      return undefined;
    });
    return config;
  },
};

export default nextConfig;