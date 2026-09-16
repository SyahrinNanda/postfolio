import type { NextConfig } from "next";

const isExport = process.env.NEXT_EXPORT === "true";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ["better-sqlite3"],
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  ...(isExport
    ? {
        output: "export",
        basePath: "/postfolio",
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
