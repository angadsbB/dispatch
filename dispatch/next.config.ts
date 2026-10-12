import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "*.cursor.sh",
    "*.cursor.com",
    "*.vercel.app",
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "127.0.0.1:43123",
        "localhost:43123",
        "*.vercel.app",
        "*.cursor.sh",
        "*.cursor.com",
      ],
    },
  },
};

export default nextConfig;
