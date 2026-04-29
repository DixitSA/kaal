const nextConfig = {
  outputFileTracingRoot: process.cwd(),
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
