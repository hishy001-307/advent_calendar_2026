import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";
const siteBasePath = isProduction ? "/physlab2026" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(siteBasePath ? { basePath: siteBasePath } : {}),
  env: {
    NEXT_PUBLIC_STATIC_BASE_PATH: siteBasePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
