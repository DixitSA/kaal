import path from "path";

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, "../../"),
  turbopack: {
    rootDirectory: ".",
  },
};

export default nextConfig;
