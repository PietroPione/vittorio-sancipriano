import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.backendvittoriosancipriano.com",
        pathname: "/**",
      },
    ],
    unoptimized: false, // va bene così
  },
};

export default nextConfig;
