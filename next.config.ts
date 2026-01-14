// 

// 一旦デバッグのため避難↑


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/physlab2026",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
