// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Pas besoin de spécifier turboMode ici, car c'est activé par défaut
  },
};

export default nextConfig;
