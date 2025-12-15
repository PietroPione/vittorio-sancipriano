import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.vittoriosancipriano.com",
        pathname: "/**",
      },
    ],
    unoptimized: false, // va bene così
  },
};

export default nextConfig;
