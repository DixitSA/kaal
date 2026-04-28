import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  webpack: (config, { isServer }) => {
    config.module.exprContextCritical = false;
    
    // Tell webpack to skip bundling calculateAstronomia
    // It's server-only code that uses Node.js require()
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        (data: { request?: string }, callback: (err: any, result?: string) => void) => {
          if (data.request?.includes("calculateAstronomia")) {
            return callback(null, `module.exports = {}`);
          }
          if (data.request?.includes("astronomia")) {
            return callback(null, `module.exports = {}`);
          }
          callback();
        }
      );
    }
    
    return config;
  },
};

export default nextConfig;
