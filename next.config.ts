import type { NextConfig } from "next";

const isExport = process.env.NEXT_EXPORT === "true";
const basePath = isExport ? "/postfolio" : "";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ["better-sqlite3"],
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  ...(isExport
    ? {
        output: "export",
        basePath: basePath,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
