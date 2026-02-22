// 

// 一旦デバッグのため避難↑


import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(isProduction ? { basePath: "/physlab2026" } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
