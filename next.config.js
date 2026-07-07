const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  // ESLint was just added to this project (previously had no lint config at all).
  // The existing codebase has real pre-existing lint findings that would otherwise
  // fail every production build. Run `npm run lint` explicitly to see them; don't
  // let a first-ever lint pass block deploys until they're triaged and fixed.
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    config.module.exprContextCritical = false;
    
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        (data, callback) => {
          const request = data.request || "";
          // Only externalize the astronomia npm package itself, not local source files
          // that happen to have "astronomia" in their path.
          if (request === "astronomia" || request.startsWith("astronomia/")) {
            return callback(null, "commonjs " + request);
          }
          callback();
        }
      );
    }
    
    return config;
  },
};

export default nextConfig;
