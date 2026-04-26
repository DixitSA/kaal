import path from "path";

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, "../../"),
  experimental: {
    turbo: {
      resolveAlias: {
        "@": "./src",
      },
    },
  },
};

export default nextConfig;
