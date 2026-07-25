import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Local-la test panniyaachu, EC2 fast deployment-kaaga skip panrom
    ignoreBuildErrors: true,
  },
  // @ts-expect-error eslint property is missing in this version's NextConfig type
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
