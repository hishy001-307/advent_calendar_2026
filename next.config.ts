// next.config.ts
import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  // ★ オプションは一旦"空"にして通す（後で足す）
  options: {},
});

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // 静的サイトとしてエクスポート
  output: 'export',
  // 画像最適化を無効化（静的エクスポートに必要）
  images: {
    unoptimized: true,
  },
  experimental: {
    // ★ Rust MDX ローダを無効化（JSローダを使う）
    mdxRs: false,
  },
};

export default withMDX(nextConfig);
