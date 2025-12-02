import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http", // 👈 CAMBIATO QUI
        hostname: "vs.ferdinandocambiale.com",
        pathname: "/**", // 👈 CONSIGLIATO
      },
    ],
    unoptimized: false, // va bene così
  },
};

export default nextConfig;
