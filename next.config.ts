import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "favicon.twenty.com" },
      { protocol: "https", hostname: "icons.duckduckgo.com" },
      { protocol: "https", hostname: "www.google.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.unsplash.com" },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000"] },
  },
};

export default nextConfig;
