import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow knowledge files reading server side
  serverExternalPackages: [],
};

export default nextConfig;
