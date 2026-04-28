const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  webpack: (config, { isServer }) => {
    config.module.exprContextCritical = false;
    
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        (data, callback) => {
          const request = data.request || "";
          if (request.toLowerCase().includes("astronomia")) {
            return callback(null, "var {}");
          }
          callback();
        }
      );
    }
    
    return config;
  },
};

export default nextConfig;
