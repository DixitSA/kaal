// Next.js dev mode wraps modules in eval() for source maps, so 'unsafe-eval' is
// required for script execution to work locally. Production builds don't use
// eval, so the stricter policy applies there.
const scriptSrc = process.env.NODE_ENV === "development" ? "'self' 'unsafe-inline' 'unsafe-eval'" : "'self' 'unsafe-inline'";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Content-Security-Policy",
    value: `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`,
  },
];

const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
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
